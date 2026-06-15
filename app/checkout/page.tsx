"use client"

import { useState, FormEvent, useEffect } from "react"
import { motion } from "framer-motion"
import { useCart } from "@/lib/cart"
import { useUser } from "@/lib/hooks/useUser"
import { createClient } from "@/lib/supabase/client"

type Field = { name: string; label: string; type?: string; required?: boolean; half?: boolean; placeholder?: string }

const FIELDS: Field[] = [
  { name: "first_name", label: "Vorname",             required: true,  half: true  },
  { name: "last_name",  label: "Nachname",            required: true,  half: true  },
  { name: "email",      label: "E-Mail",              type: "email",   required: true  },
  { name: "phone",      label: "Telefon",             type: "tel",     placeholder: "+43..." },
  { name: "address1",   label: "Straße + Hausnr.",    required: true  },
  { name: "address2",   label: "Adresszusatz",        placeholder: "Tür, Stiege …" },
  { name: "zip",        label: "PLZ",                 required: true,  half: true  },
  { name: "city",       label: "Ort",                 required: true,  half: true  },
]

const COUNTRIES = ["Österreich","Deutschland","Belgien","Bulgarien","Dänemark","Estland","Finnland",
  "Frankreich","Griechenland","Irland","Italien","Kroatien","Lettland","Litauen","Luxemburg","Malta",
  "Niederlande","Polen","Portugal","Rumänien","Schweden","Slowakei","Slowenien","Spanien","Tschechien","Ungarn","Zypern"]

const PAYMENT_LOGOS = [
  { src: "/pay-visa.svg",       alt: "Visa"        },
  { src: "/pay-mastercard.svg", alt: "Mastercard"  },
  { src: "/pay-applepay.svg",   alt: "Apple Pay"   },
  { src: "/pay-googlepay.svg",  alt: "Google Pay"  },
  { src: "/pay-amazonpay.svg",  alt: "Amazon Pay"  },
  { src: "/pay-revolut.svg",    alt: "Revolut Pay" },
  { src: "/pay-eps.svg",        alt: "eps"         },
  { src: "/pay-billie.svg",     alt: "Billie"      },
  { src: "/pay-sepa.svg",       alt: "SEPA"        },
  { src: "/pay-sepa-debit.svg", alt: "SEPA-Lastschrift" },
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

  useEffect(() => {
    if (!user) return
    const prefill: Record<string, string> = { country: "Österreich" }
    if (profile?.first_name) prefill.first_name = profile.first_name
    if (profile?.last_name)  prefill.last_name  = profile.last_name
    if (user.email)          prefill.email      = user.email
    if (profile?.phone)      prefill.phone      = profile.phone ?? ""
    supabase.from("addresses").select("*").eq("user_id", user.id).eq("is_default", true).single()
      .then(({ data }) => {
        if (data?.street) prefill.address1 = data.street
        if (data?.city)   prefill.city     = data.city
        if (data?.zip)    prefill.zip      = data.zip
        setForm(prev => ({ ...prev, ...prefill }))
      })
  }, [user, profile])

  const items    = state.items
  const shipping = total >= 50 ? 0 : 4.99
  const grand    = total + shipping

  function validate() {
    const next: Record<string, boolean> = {}
    FIELDS.filter(f => f.required).forEach(f => { if (!form[f.name]?.trim()) next[f.name] = true })
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const orderPayload = () => ({
    email: form.email, phone: form.phone,
    line_items: items.map(item => ({ title: item.name, variant_title: item.pack, price: item.price.toFixed(2), quantity: item.qty })),
    shipping_address: { first_name: form.first_name, last_name: form.last_name, address1: form.address1,
      address2: form.address2, city: form.city, zip: form.zip, country: form.country, phone: form.phone },
    shipping_price: shipping.toFixed(2),
  })

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setServerError("")
    try {
      setLoadingMsg("Bestellung wird übermittelt …")
      const res = await fetch("/api/checkout/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(orderPayload()) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Fehler")
      const { order_token } = data
      setLoadingMsg("Zahlung wird vorbereitet …")
      let url: string | null = null
      for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 1500))
        const s = await (await fetch(`/api/checkout/status?token=${order_token}`)).json()
        if (s.ready && s.url) { url = s.url; break }
      }
      if (!url) throw new Error("Zeitüberschreitung — bitte nochmal versuchen.")
      window.location.href = url
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Unbekannter Fehler")
      setLoading(false)
    }
  }

  const inp = (err: boolean): React.CSSProperties => ({
    width: "100%", boxSizing: "border-box",
    padding: "15px 18px",
    borderRadius: 14,
    border: `1.5px solid ${err ? "#e85c5c" : "rgba(53,56,63,0.16)"}`,
    background: err ? "rgba(232,92,92,0.04)" : "rgba(255,255,255,0.68)",
    color: "#35383f", fontSize: "max(16px, 0.95rem)",
    fontFamily: "inherit", outline: "none",
  })

  return (
    <div style={{ background: "#bcc0ca", minHeight: "100vh" }}>
      <div className="max-w-5xl mx-auto"
        style={{ padding: "clamp(96px,14vh,156px) clamp(20px,5vw,64px) clamp(72px,10vh,128px)" }}>

        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          className="font-druk-wide uppercase leading-none"
          style={{ fontSize: "clamp(3rem, 9vw, 8rem)", letterSpacing: "-0.035em", color: "#35383f",
            marginBottom: "clamp(36px,5vh,60px)" }}>
          Kasse
        </motion.h1>

        <div className="lg:grid lg:grid-cols-[1fr_340px] gap-10 items-start flex flex-col">

          {/* ── FORM ── */}
          <form onSubmit={handleSubmit} noValidate>

            <p className="font-ekstra uppercase mb-5"
              style={{ fontSize: 11, letterSpacing: "0.28em", color: "rgba(53,56,63,0.45)" }}>
              Lieferadresse
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {FIELDS.map(f => (
                <div key={f.name} style={{ gridColumn: f.half ? "span 1" : "span 2" }}>
                  <label className="font-ekstra uppercase block mb-2"
                    style={{ fontSize: 10, letterSpacing: "0.22em", color: "rgba(53,56,63,0.50)" }}>
                    {f.label}{f.required && " *"}
                  </label>
                  <input
                    type={f.type ?? "text"} name={f.name} autoComplete={f.name}
                    placeholder={f.placeholder} value={form[f.name] ?? ""}
                    onChange={e => { setForm(p => ({ ...p, [f.name]: e.target.value })); if (errors[f.name]) setErrors(p => ({ ...p, [f.name]: false })) }}
                    style={inp(!!errors[f.name])}
                  />
                  {errors[f.name] && (
                    <p className="font-ekstra mt-1.5" style={{ fontSize: 10, color: "#e85c5c" }}>Pflichtfeld</p>
                  )}
                </div>
              ))}

              {/* Country */}
              <div style={{ gridColumn: "span 2" }}>
                <label className="font-ekstra uppercase block mb-2"
                  style={{ fontSize: 10, letterSpacing: "0.22em", color: "rgba(53,56,63,0.50)" }}>
                  Land *
                </label>
                <select
                  name="country" value={form.country ?? "Österreich"}
                  onChange={e => setForm(p => ({ ...p, country: e.target.value }))}
                  style={{ ...inp(false), appearance: "none", cursor: "pointer", paddingRight: 44,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2335383f' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat", backgroundPosition: "right 18px center" }}>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Payment logos */}
            <div className="mt-8">
              <p className="font-ekstra uppercase mb-3"
                style={{ fontSize: 10, letterSpacing: "0.28em", color: "rgba(53,56,63,0.40)" }}>
                Akzeptierte Zahlungsmethoden
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {PAYMENT_LOGOS.map(logo => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={logo.alt} src={logo.src} alt={logo.alt} title={logo.alt}
                    style={{ height: 40, width: "auto", maxWidth: 76, objectFit: "contain", borderRadius: 7 }} />
                ))}
              </div>
            </div>

            {serverError && (
              <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                className="font-ekstra mt-5 p-4 rounded-xl"
                style={{ fontSize: "0.92rem", color: "#e85c5c", background: "rgba(232,92,92,0.07)", border: "1px solid rgba(232,92,92,0.18)" }}>
                {serverError}
              </motion.p>
            )}

            <button type="submit" disabled={loading || items.length === 0}
              className="w-full mt-8 font-ekstra uppercase rounded-full"
              style={{ height: 60, background: items.length === 0 ? "rgba(53,56,63,0.22)" : "#35383f",
                color: "#e8e4dc", letterSpacing: "0.22em", fontSize: 14, border: "none",
                cursor: items.length === 0 ? "not-allowed" : "pointer",
                boxShadow: items.length > 0 ? "0 8px 28px rgba(53,56,63,0.22)" : "none" }}>
              {loading ? loadingMsg : "Jetzt bezahlen →"}
            </button>
          </form>

          {/* ── DARK SUMMARY ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky w-full" style={{ top: "calc(72px + 28px)" }}>
            <div style={{ background: "#35383f", borderRadius: 24, padding: "clamp(24px,3.5vh,38px)",
              boxShadow: "0 20px 60px rgba(53,56,63,0.22)" }}>

              <p className="font-ekstra uppercase mb-5"
                style={{ fontSize: 10, letterSpacing: "0.30em", color: "rgba(232,228,220,0.35)" }}>
                Bestellübersicht
              </p>

              {items.length === 0 ? (
                <p className="font-ekstra" style={{ fontSize: "0.95rem", color: "rgba(232,228,220,0.40)" }}>
                  Warenkorb ist leer.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 22 }}>
                  {items.map(item => (
                    <div key={`${item.id}__${item.pack}`} className="flex justify-between items-start gap-3">
                      <div>
                        <p className="font-ekstra" style={{ fontSize: "0.92rem", color: "rgba(232,228,220,0.80)", lineHeight: 1.4 }}>
                          {item.name} <span style={{ opacity: 0.5 }}>×{item.qty}</span>
                        </p>
                        <p className="font-ekstra uppercase" style={{ fontSize: 9, letterSpacing: "0.14em", color: "rgba(232,228,220,0.33)" }}>
                          {item.pack}
                        </p>
                      </div>
                      <p className="font-druk-wide shrink-0" style={{ fontSize: "0.95rem", color: "rgba(232,228,220,0.80)" }}>
                        {(item.price * item.qty).toFixed(2).replace(".", ",")} €
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 16 }} />

              <div className="flex justify-between items-center mb-3">
                <span className="font-ekstra" style={{ fontSize: "0.9rem", color: "rgba(232,228,220,0.42)" }}>Versand</span>
                <span className="font-druk-wide" style={{ fontSize: "0.95rem", color: shipping === 0 ? "#a0ba87" : "rgba(232,228,220,0.65)" }}>
                  {shipping === 0 ? "Gratis" : `${shipping.toFixed(2).replace(".", ",")} €`}
                </span>
              </div>

              <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 20 }} />

              <div className="mb-1">
                <p className="font-ekstra uppercase mb-2" style={{ fontSize: 10, letterSpacing: "0.26em", color: "rgba(232,228,220,0.35)" }}>Gesamt</p>
                <p className="font-druk-wide leading-none"
                  style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.6rem)", color: "#e8e4dc", letterSpacing: "-0.03em" }}>
                  {grand.toFixed(2).replace(".", ",")} €
                </p>
                <p className="font-ekstra mt-2" style={{ fontSize: 9, letterSpacing: "0.16em", color: "rgba(232,228,220,0.25)", textTransform: "uppercase" }}>
                  inkl. MwSt.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
