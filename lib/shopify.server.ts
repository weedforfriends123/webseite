// Server-only – never import from client components or "use client" files.
// Token and secret stay exclusively on the server.

const SHOP   = process.env.SHOPIFY_STORE_DOMAIN!
const CID    = process.env.SHOPIFY_CLIENT_ID!
const CSEC   = process.env.SHOPIFY_CLIENT_SECRET!
const VER    = process.env.SHOPIFY_API_VERSION ?? "2026-04"

type CachedToken = { token: string; expiresAt: number }
let _cache: CachedToken | null = null

async function getToken(): Promise<string> {
  const now = Date.now()
  if (_cache && _cache.expiresAt > now + 60_000) return _cache.token

  const res = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CID,
      client_secret: CSEC,
    }),
  })

  if (!res.ok) {
    throw new Error(`Shopify token request failed: ${res.status}`)
  }

  const data = await res.json()
  if (!data.access_token) throw new Error("Shopify: no access_token in response")

  const expiresIn = Number(data.expires_in ?? 86399)
  _cache = { token: data.access_token, expiresAt: now + Math.max(60, expiresIn - 300) * 1000 }
  return _cache.token
}

async function shopifyRequest(path: string, init: RequestInit): Promise<Response> {
  const token = await getToken()
  const url = `https://${SHOP}/admin/api/${VER}${path}`

  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Shopify-Access-Token": token,
      ...(init.headers as Record<string, string> | undefined),
    },
  })

  if (res.status === 401) {
    // Token expired – flush cache and retry once
    _cache = null
    const freshToken = await getToken()
    return fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Shopify-Access-Token": freshToken,
        ...(init.headers as Record<string, string> | undefined),
      },
    })
  }

  return res
}

export type ShopifyLineItem = {
  title: string
  variant_title?: string
  price: string
  quantity: number
}

export type ShopifyAddress = {
  first_name: string
  last_name: string
  address1: string
  address2?: string
  city: string
  zip: string
  country: string
  phone?: string
}

// ── Customer sync ────────────────────────────────────────────────────────────

export type ShopifyCustomerInput = {
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  accepts_marketing?: boolean
}

export async function syncShopifyCustomer(input: ShopifyCustomerInput): Promise<number | null> {
  // Search for existing customer by email
  const searchRes = await shopifyRequest(
    `/customers/search.json?query=email:${encodeURIComponent(input.email)}&fields=id,email`,
    { method: "GET" },
  )

  if (!searchRes.ok) {
    console.error("[shopify] customer search failed:", searchRes.status)
    return null
  }

  const searchData = await searchRes.json()
  const existing = searchData.customers?.[0]

  if (existing) {
    // Update marketing consent if needed
    const updateRes = await shopifyRequest(`/customers/${existing.id}.json`, {
      method: "PUT",
      body: JSON.stringify({
        customer: {
          id: existing.id,
          accepts_marketing: input.accepts_marketing ?? false,
          ...(input.first_name ? { first_name: input.first_name } : {}),
          ...(input.last_name  ? { last_name:  input.last_name  } : {}),
          ...(input.phone      ? { phone:      input.phone      } : {}),
        },
      }),
    })
    if (!updateRes.ok) {
      console.error("[shopify] customer update failed:", updateRes.status)
    }
    return existing.id as number
  }

  // Create new customer
  const createRes = await shopifyRequest("/customers.json", {
    method: "POST",
    body: JSON.stringify({
      customer: {
        email:              input.email,
        first_name:         input.first_name ?? "",
        last_name:          input.last_name  ?? "",
        phone:              input.phone,
        accepts_marketing:  input.accepts_marketing ?? false,
        verified_email:     true,
      },
    }),
  })

  if (!createRes.ok) {
    console.error("[shopify] customer create failed:", createRes.status)
    return null
  }

  const createData = await createRes.json()
  return (createData.customer?.id as number) ?? null
}

// ── Order creation ────────────────────────────────────────────────────────────

export type CreateOrderPayload = {
  email: string
  phone?: string
  note?: string
  financial_status?: "pending" | "paid"
  line_items: ShopifyLineItem[]
  shipping_address: ShopifyAddress
  billing_address?: ShopifyAddress
  shipping_price?: string
  amount_cents?: number
}

export async function createShopifyOrder(payload: CreateOrderPayload) {
  const customerId = await syncShopifyCustomer({
    email:      payload.email,
    first_name: payload.shipping_address.first_name,
    last_name:  payload.shipping_address.last_name,
    phone:      payload.phone ?? payload.shipping_address.phone,
  })

  const shippingLine = {
    title: "Standardversand",
    price: payload.shipping_price ?? "0.00",
    code:  "STANDARD",
  }

  const financialStatus = payload.financial_status ?? "pending"

  // Bei "paid": Transaktion mitliefern damit Shopify die Order als bezahlt markiert
  const transactions = financialStatus === "paid" && payload.amount_cents !== undefined
    ? [{
        kind:    "sale",
        status:  "success",
        amount:  (payload.amount_cents / 100).toFixed(2),
        gateway: payload.amount_cents === 0 ? "manual" : "Stripe",
      }]
    : undefined

  const order = {
    email:            payload.email,
    phone:            payload.phone,
    note:             payload.note,
    financial_status: financialStatus,
    line_items:       payload.line_items,
    billing_address:  payload.billing_address ?? payload.shipping_address,
    shipping_address: payload.shipping_address,
    shipping_lines:   [shippingLine],
    ...(transactions ? { transactions } : {}),
    ...(customerId   ? { customer: { id: customerId } } : {}),
  }

  const res = await shopifyRequest("/orders.json", {
    method: "POST",
    body: JSON.stringify({ order }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Shopify order creation failed ${res.status}: ${text}`)
  }

  const data = await res.json()
  return data.order as { id: number; order_number: number; [k: string]: unknown }
}
