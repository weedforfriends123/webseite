"use client"

import { useState, FormEvent, useEffect } from "react"
import { motion } from "framer-motion"
import { useCart } from "@/lib/cart"
import { useUser } from "@/lib/hooks/useUser"
import { createClient } from "@/lib/supabase/client"

const TEXT  = "#35383f"
const MUTED = "rgba(53,56,63,0.55)"
const DIM   = "rgba(53,56,63,0.12)"

type Field = {
  name: string
  label: string
  type?: string
  required?: boolean
  half?: boolean
  placeholder?: string
}

const FIELDS: Field[] = [
  { name: "first_name", label: "Vorname",      required: true,  half: true  },
  { name: "last_name",  label: "Nachname",     required: true,  half: true  },
  { name: "email",      label: "E-Mail",       type: "email",   required: true  },
  { name: "phone",      label: "Telefon",      type: "tel",     placeholder: "+43..." },
  { name: "address1",   label: "Straße + Hausnummer", required: true  },
  { name: "address2",   label: "Adresszusatz", placeholder: "Tür, Stiege ..." },
  { name: "zip",        label: "PLZ",          required: true,  half: true  },
  { name: "city",       label: "Ort",          required: true,  half: true  },
]

const COUNTRIES = [
  "Österreich",
  "Deutschland",
  "Belgien",
  "Bulgarien",
  "Dänemark",
  "Estland",
  "Finnland",
  "Frankreich",
  "Griechenland",
  "Irland",
  "Italien",
  "Kroatien",
  "Lettland",
  "Litauen",
  "Luxemburg",
  "Malta",
  "Niederlande",
  "Polen",
  "Portugal",
  "Rumänien",
  "Schweden",
  "Slowakei",
  "Slowenien",
  "Spanien",
  "Tschechien",
  "Ungarn",
  "Zypern",
]

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: "100%",
  padding: "13px 16px",
  borderRadius: 12,
  border: `1.5px solid ${hasError ? "#e85c5c" : "rgba(53,56,63,0.22)"}`,
  background: "rgba(255,255,255,0.72)",
  color: TEXT,
  fontSize: "max(16px, 0.9rem)",
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
})

type PaymentMethod = "card" | "apple_pay" | "bank_transfer"

const PAYMENT_METHODS: { id: PaymentMethod; label: string; sublabel: string; icon: string }[] = [
  { id: "card",          label: "Kreditkarte",      sublabel: "Visa, Mastercard, Amex",    icon: "💳" },
  { id: "apple_pay",     label: "Apple Pay",        sublabel: "Safari & iOS",              icon: "" },
  { id: "bank_transfer", label: "Banküberweisung",  sublabel: "SEPA, dauert 1–3 Werktage", icon: "🏦" },
]

export default function CheckoutPage() {
  const { state, total } = useCart()
  const { user, profile } = useUser()
  const supabase = createClient()

  const [form, setForm] = useState<Record<string, string>>({ country: "Österreich" })
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState("Zahlung wird vorbereitet …")
  const [serverError, setServerError] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")

  // Pre-fill from saved profile + default address
  useEffect(() => {
    if (!user) return
    const prefill: Record<string, string> = { country: "Österreich" }
    if (profile?.first_name) prefill.first_name = profile.first_name
    if (profile?.last_name)  prefill.last_name  = profile.last_name
    if (user.email)          prefill.email      = user.email
    if (profile?.phone)      prefill.phone      = profile.phone ?? ""

    supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_default", true)
      .single()
      .then(({ data }) => {
        if (data?.street) prefill.address1 = data.street
        if (data?.city)   prefill.city     = data.city
        if (data?.zip)    prefill.zip      = data.zip
        setForm(prev => ({ ...prev, ...prefill }))
      })
  }, [user, profile])

  const items = state.items
  const shipping = total >= 50 ? 0 : 4.99
  const grand = total + shipping

  function validate() {
    const next: Record<string, boolean> = {}
    FIELDS.filter(f => f.required).forEach(f => {
      if (!form[f.name]?.trim()) next[f.name] = true
    })
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const orderPayload = () => ({
    email: form.email,
    phone: form.phone,
    line_items: items.map(item => ({
      title: item.name,
      variant_title: item.pack,
      price: item.price.toFixed(2),
      quantity: item.qty,
    })),
    shipping_address: {
      first_name: form.first_name,
      last_name:  form.last_name,
      address1:   form.address1,
      address2:   form.address2,
      city:       form.city,
      zip:        form.zip,
      country:    form.country,
      phone:      form.phone,
    },
    shipping_price: shipping.toFixed(2),
  })

  async function handleBankTransfer() {
    setLoadingMsg("Bestellung wird angelegt …")
    const res = await fetch("/api/checkout/bank-transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload()),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Fehler")
    const params = new URLSearchParams({
      ref:    data.reference,
      amount: data.amount,
      iban:   data.bank.iban,
      bic:    data.bank.bic,
      owner:  data.bank.owner,
      bank:   data.bank.name,
    })
    window.location.href = `/checkout/pending?${params.toString()}`
  }

  async function handleCardPayment() {
    setLoadingMsg("Bestellung wird übermittelt …")
    const res = await fetch("/api/checkout/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload()),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Fehler")
    const { order_token } = data

    setLoadingMsg("Zahlung wird vorbereitet …")
    let paymentUrl: string | null = null
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 1500))
      const statusRes = await fetch(`/api/checkout/status?token=${order_token}`)
      const statusData = await statusRes.json()
      if (statusData.ready && statusData.url) {
        paymentUrl = statusData.url
        break
      }
    }
    if (!paymentUrl) throw new Error("Zeitüberschreitung — bitte nochmal versuchen.")
    window.location.href = paymentUrl
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setServerError("")

    try {
      if (paymentMethod === "bank_transfer") {
        await handleBankTransfer()
      } else {
        await handleCardPayment()
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Unbekannter Fehler")
      setLoading(false)
    }
  }

  return (
    <div style={{ background: "#bcc0ca", minHeight: "100vh" }}>
      <div
        className="max-w-5xl mx-auto"
        style={{ padding: "clamp(88px,14vh,156px) clamp(16px,5vw,64px) clamp(60px,10vh,120px)" }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-druk-wide uppercase leading-none mb-10"
          style={{ fontSize: "clamp(2rem,8vw,7rem)", letterSpacing: "-0.03em", color: TEXT }}
        >
          Kasse
        </motion.h1>

        <div className="lg:grid lg:grid-cols-[1fr_300px] gap-10 items-start flex flex-col">

          {/* ── ADDRESS FORM ── */}
          <form onSubmit={handleSubmit} noValidate>
            <p className="font-ekstra uppercase mb-5" style={{ fontSize: 10, letterSpacing: "0.28em", color: MUTED }}>
              Lieferadresse
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {FIELDS.map(f => (
                <div
                  key={f.name}
                  style={{ gridColumn: f.half ? "span 1" : "span 2" }}
                >
                  <label className="font-ekstra uppercase block mb-1.5" style={{ fontSize: 9, letterSpacing: "0.22em", color: MUTED }}>
                    {f.label}{f.required && " *"}
                  </label>
                  <input
                    type={f.type ?? "text"}
                    name={f.name}
                    autoComplete={f.name}
                    placeholder={f.placeholder}
                    value={form[f.name] ?? ""}
                    onChange={e => {
                      setForm(p => ({ ...p, [f.name]: e.target.value }))
                      if (errors[f.name]) setErrors(p => ({ ...p, [f.name]: false }))
                    }}
                    style={inputStyle(!!errors[f.name])}
                  />
                  {errors[f.name] && (
                    <p className="font-ekstra mt-1" style={{ fontSize: 10, color: "#e85c5c" }}>Pflichtfeld</p>
                  )}
                </div>
              ))}

              {/* Land Dropdown */}
              <div style={{ gridColumn: "span 2" }}>
                <label className="font-ekstra uppercase block mb-1.5" style={{ fontSize: 9, letterSpacing: "0.22em", color: MUTED }}>
                  Land *
                </label>
                <select
                  name="country"
                  value={form.country ?? "Österreich"}
                  onChange={e => setForm(p => ({ ...p, country: e.target.value }))}
                  style={{
                    ...inputStyle(false),
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2335383f' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 16px center",
                    paddingRight: 40,
                    cursor: "pointer",
                  }}
                >
                  {COUNTRIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── PAYMENT METHOD ── */}
            <p className="font-ekstra uppercase mt-8 mb-4" style={{ fontSize: 10, letterSpacing: "0.28em", color: MUTED }}>
              Zahlungsmethode
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {PAYMENT_METHODS.map(m => {
                const active = paymentMethod === m.id
                return (
                  <motion.button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    whileTap={{ scale: 0.985 }}
                    className="flex items-center gap-4 text-left w-full"
                    style={{
                      padding: "14px 18px",
                      borderRadius: 14,
                      border: `1.5px solid ${active ? TEXT : "rgba(53,56,63,0.18)"}`,
                      background: active ? "rgba(53,56,63,0.07)" : "rgba(255,255,255,0.55)",
                      cursor: "pointer",
                      transition: "all 0.18s ease",
                    }}
                  >
                    <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>{m.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p className="font-ekstra uppercase" style={{ fontSize: 11, letterSpacing: "0.18em", color: TEXT, marginBottom: 2 }}>
                        {m.label}
                      </p>
                      <p className="font-ekstra" style={{ fontSize: 9, color: MUTED, letterSpacing: "0.10em" }}>
                        {m.sublabel}
                      </p>
                    </div>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%",
                      border: `1.5px solid ${active ? TEXT : "rgba(53,56,63,0.25)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      {active && <div style={{ width: 9, height: 9, borderRadius: "50%", background: TEXT }} />}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {serverError && (
              <p className="font-ekstra mt-4 p-3 rounded-xl" style={{ fontSize: "0.88rem", color: "#e85c5c", background: "rgba(232,92,92,0.08)", border: "1px solid rgba(232,92,92,0.18)" }}>
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="w-full mt-8 py-4 font-ekstra uppercase rounded-full transition-all duration-200"
              style={{
                background: items.length === 0 ? "rgba(53,56,63,0.25)" : TEXT,
                color: "#e8e4dc",
                letterSpacing: "0.20em",
                fontSize: 13,
                border: "none",
                cursor: items.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              {loading ? loadingMsg : paymentMethod === "bank_transfer" ? "Jetzt bestellen" : "Jetzt bezahlen"}
            </button>
          </form>

          {/* ── ORDER SUMMARY ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky w-full"
            style={{ top: "calc(64px + 24px)" }}
          >
            <div style={{
              background: "rgba(255,255,255,0.48)",
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.72)",
              padding: "clamp(22px,3vh,32px)",
            }}>
              <p className="font-ekstra uppercase mb-2" style={{ fontSize: 10, letterSpacing: "0.28em", color: MUTED }}>
                Bestellübersicht
              </p>
              <div style={{ height: 1, background: DIM, marginBottom: 16, marginTop: 8 }} />

              {items.length === 0 ? (
                <p className="font-ekstra" style={{ fontSize: "0.88rem", color: MUTED }}>Warenkorb ist leer.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                  {items.map(item => (
                    <div key={`${item.id}__${item.pack}`} className="flex justify-between">
                      <span className="font-ekstra" style={{ fontSize: "0.85rem", color: MUTED }}>
                        {item.name} <span style={{ opacity: 0.6 }}>×{item.qty}</span>
                        <br />
                        <span style={{ fontSize: 10, letterSpacing: "0.12em", opacity: 0.55 }}>{item.pack}</span>
                      </span>
                      <span className="font-druk-wide" style={{ fontSize: "0.88rem", color: TEXT, whiteSpace: "nowrap", marginLeft: 12 }}>
                        {(item.price * item.qty).toFixed(2).replace(".", ",")} €
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ height: 1, background: DIM, marginBottom: 12 }} />
              <div className="flex justify-between mb-2">
                <span className="font-ekstra" style={{ fontSize: "0.88rem", color: MUTED }}>Versand</span>
                <span className="font-druk-wide" style={{ fontSize: "0.88rem", color: TEXT }}>
                  {shipping === 0 ? "Gratis" : `${shipping.toFixed(2).replace(".", ",")} €`}
                </span>
              </div>
              <div style={{ height: 1, background: DIM, marginBottom: 12 }} />
              <div className="flex justify-between items-baseline">
                <span className="font-ekstra" style={{ fontSize: "0.9rem", color: TEXT }}>Gesamt</span>
                <span className="font-druk-wide" style={{ fontSize: "clamp(1.2rem,2vw,1.5rem)", color: TEXT }}>
                  {grand.toFixed(2).replace(".", ",")} €
                </span>
              </div>
              <p className="font-ekstra mt-1" style={{ fontSize: 9, letterSpacing: "0.16em", color: "rgba(53,56,63,0.32)", textTransform: "uppercase" }}>
                inkl. MwSt.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
