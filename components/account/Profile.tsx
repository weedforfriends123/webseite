"use client"

import { useState } from "react"

function Field({ label, value, type = "text", placeholder = "" }: { label: string; value: string; type?: string; placeholder?: string }) {
  const [val, setVal] = useState(value)
  return (
    <div>
      <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-cream/30 block mb-2">{label}</label>
      <input
        type={type}
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-cream/[0.04] border border-cream/[0.08] text-cream text-sm font-sans focus:outline-none focus:border-lime/30 placeholder:text-cream/20 transition-colors"
      />
    </div>
  )
}

export function Profile() {
  const [saved, setSaved] = useState(false)

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-lime/60 mb-2">Konto</p>
        <h1 className="font-sans font-extrabold text-4xl text-cream">Profil & Adresse</h1>
      </div>

      {/* Personal data */}
      <div className="p-6 rounded-2xl border border-cream/[0.08] bg-cream/[0.02]">
        <h2 className="font-sans font-bold text-lg text-cream mb-6">Persönliche Daten</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Vorname" value="Max" />
          <Field label="Nachname" value="Müller" />
          <Field label="E-Mail" value="max@email.de" type="email" />
          <Field label="Telefon" value="+49 151 12345678" type="tel" />
          <Field label="Geburtsdatum" value="1995-04-20" type="date" />
        </div>
      </div>

      {/* Shipping address */}
      <div className="p-6 rounded-2xl border border-cream/[0.08] bg-cream/[0.02]">
        <h2 className="font-sans font-bold text-lg text-cream mb-6">Lieferadresse</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Field label="Straße & Hausnummer" value="Musterstraße 42" />
          </div>
          <Field label="PLZ" value="10115" />
          <Field label="Stadt" value="Berlin" />
          <div className="sm:col-span-2">
            <Field label="Adresszusatz" value="" placeholder="Etage, c/o, Firma…" />
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500) }}
          className="px-8 py-3.5 rounded-full bg-lime text-bg font-sans font-bold text-sm hover:scale-105 active:scale-95 transition-transform glow-lime"
        >
          {saved ? "✓ Gespeichert" : "Änderungen speichern"}
        </button>
      </div>
    </div>
  )
}
