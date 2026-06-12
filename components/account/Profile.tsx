"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useUser } from "@/lib/hooks/useUser"
import type { User } from "@supabase/supabase-js"
import type { Profile as ProfileType } from "@/lib/hooks/useUser"

const TEXT  = "#35383f"
const MUTED = "rgba(53,56,63,0.55)"
const DIM   = "rgba(53,56,63,0.10)"

const IS = {
  background: "rgba(255,255,255,0.72)",
  border: "1.5px solid rgba(53,56,63,0.18)",
  color: TEXT,
  boxShadow: "inset 0 1px 2px rgba(53,56,63,0.04)",
} as React.CSSProperties

const IFS = {
  background: "rgba(255,255,255,0.96)",
  border: "1.5px solid rgba(53,56,63,0.50)",
  color: TEXT,
  outline: "none",
  boxShadow: "0 0 0 3px rgba(53,56,63,0.07)",
} as React.CSSProperties

function Field({
  label, value, onChange, type = "text", placeholder = "", foc, name, onFocus, onBlur,
}: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; placeholder?: string; foc: string; name: string
  onFocus: (n: string) => void; onBlur: () => void
}) {
  const cls = "w-full px-5 py-4 rounded-xl text-sm placeholder:opacity-40 font-ekstra"
  return (
    <div className="flex flex-col gap-2">
      <label className="font-ekstra uppercase" style={{ fontSize: 10, letterSpacing: "0.28em", color: MUTED }}>
        {label}
      </label>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onFocus={() => onFocus(name)} onBlur={onBlur}
        className={cls}
        style={foc === name ? IFS : IS}
      />
    </div>
  )
}

interface Props { user: User | null; profile: ProfileType | null; signOut: () => void }

export function Profile({ user, profile }: Props) {
  const { updateProfile } = useUser()
  const supabase = createClient()
  const [foc,   setFoc]   = useState("")
  const [saved, setSaved] = useState(false)
  const [busy,  setBusy]  = useState(false)
  const [err,   setErr]   = useState("")

  const [firstName, setFirstName] = useState(profile?.first_name ?? "")
  const [lastName,  setLastName]  = useState(profile?.last_name  ?? "")
  const [phone,     setPhone]     = useState(profile?.phone      ?? "")
  const [dob,       setDob]       = useState(profile?.date_of_birth ?? "")

  // Address state
  const [street,  setStreet]  = useState("")
  const [city,    setCity]    = useState("")
  const [zip,     setZip]     = useState("")

  useEffect(() => {
    if (!user) return
    supabase.from("addresses").select("*").eq("user_id", user.id).eq("is_default", true).single()
      .then(({ data }) => {
        if (!data) return
        setStreet(data.street ?? "")
        setCity(data.city ?? "")
        setZip(data.zip ?? "")
      })
  }, [user])

  const save = async () => {
    if (!user) return
    setBusy(true); setErr("")
    const profileErr = await updateProfile({ first_name: firstName, last_name: lastName, phone, date_of_birth: dob || null })
    if (profileErr) { setErr("Fehler beim Speichern."); setBusy(false); return }

    if (street && city && zip) {
      const { data: existing } = await supabase
        .from("addresses").select("id").eq("user_id", user.id).eq("is_default", true).single()
      if (existing) {
        await supabase.from("addresses").update({ first_name: firstName, last_name: lastName, street, city, zip }).eq("id", existing.id)
      } else {
        await supabase.from("addresses").insert({ user_id: user.id, first_name: firstName, last_name: lastName, street, city, zip, is_default: true })
      }
    }

    setBusy(false); setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const cls = "w-full px-5 py-4 rounded-xl text-sm placeholder:opacity-40 font-ekstra"

  return (
    <div className="space-y-10">

      <div>
        <p className="font-ekstra uppercase mb-2" style={{ fontSize: 11, letterSpacing: "0.30em", color: "rgba(53,56,63,0.40)" }}>
          Konto
        </p>
        <h1 className="font-druk-wide uppercase leading-none" style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: TEXT }}>
          Profil & Adresse
        </h1>
      </div>

      {/* Personal */}
      <div
        style={{
          padding: "clamp(22px,3vh,32px)", borderRadius: 18,
          background: "rgba(255,255,255,0.42)", border: "1px solid rgba(255,255,255,0.68)",
        }}
      >
        <p className="font-ekstra uppercase mb-6" style={{ fontSize: 10, letterSpacing: "0.28em", color: MUTED }}>
          Persönliche Daten
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Vorname"      value={firstName} onChange={setFirstName} foc={foc} name="fn" onFocus={setFoc} onBlur={() => setFoc("")} />
          <Field label="Nachname"     value={lastName}  onChange={setLastName}  foc={foc} name="ln" onFocus={setFoc} onBlur={() => setFoc("")} />
          <Field label="E-Mail"       value={user?.email ?? ""} onChange={() => {}} type="email" foc={foc} name="em" onFocus={setFoc} onBlur={() => setFoc("")} placeholder="(nicht änderbar)" />
          <Field label="Telefon"      value={phone}  onChange={setPhone}  type="tel"  foc={foc} name="ph" onFocus={setFoc} onBlur={() => setFoc("")} placeholder="+49 151 …" />
          <Field label="Geburtsdatum" value={dob}    onChange={setDob}    type="date" foc={foc} name="dob" onFocus={setFoc} onBlur={() => setFoc("")} />
        </div>
      </div>

      {/* Address */}
      <div
        style={{
          padding: "clamp(22px,3vh,32px)", borderRadius: 18,
          background: "rgba(255,255,255,0.42)", border: "1px solid rgba(255,255,255,0.68)",
        }}
      >
        <p className="font-ekstra uppercase mb-6" style={{ fontSize: 10, letterSpacing: "0.28em", color: MUTED }}>
          Standardlieferadresse
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Field label="Straße & Hausnummer" value={street} onChange={setStreet} foc={foc} name="str" onFocus={setFoc} onBlur={() => setFoc("")} placeholder="Musterstraße 42" />
          </div>
          <Field label="PLZ"  value={zip}  onChange={setZip}  foc={foc} name="zip" onFocus={setFoc} onBlur={() => setFoc("")} placeholder="10115" />
          <Field label="Stadt" value={city} onChange={setCity} foc={foc} name="city" onFocus={setFoc} onBlur={() => setFoc("")} placeholder="Berlin" />
        </div>
      </div>

      {err && <p className="font-ekstra" style={{ fontSize: "0.88rem", color: "#c0392b" }}>{err}</p>}

      <button
        onClick={save} disabled={busy}
        className="px-10 py-4 font-ekstra uppercase rounded-full transition-all duration-200 disabled:opacity-40"
        style={{ background: TEXT, color: "#e8e4dc", letterSpacing: "0.22em", fontSize: 13 }}
      >
        {busy ? "Speichern…" : saved ? "✓ Gespeichert" : "Änderungen speichern"}
      </button>
    </div>
  )
}
