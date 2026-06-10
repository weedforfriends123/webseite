"use client"

import { useState } from "react"

export function Password() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" })
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (form.next.length < 8) { setError("Passwort muss mindestens 8 Zeichen haben."); return }
    if (form.next !== form.confirm) { setError("Passwörter stimmen nicht überein."); return }
    setError("")
    setSaved(true)
    setForm({ current: "", next: "", confirm: "" })
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-lime/60 mb-2">Konto</p>
        <h1 className="font-sans font-extrabold text-4xl text-cream">Passwort ändern</h1>
      </div>

      <div className="max-w-md">
        <div className="p-6 rounded-2xl border border-cream/[0.08] bg-cream/[0.02]">
          <form onSubmit={submit} className="space-y-4">
            {[
              { key: "current", label: "Aktuelles Passwort" },
              { key: "next", label: "Neues Passwort" },
              { key: "confirm", label: "Neues Passwort bestätigen" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-cream/30 block mb-2">{label}</label>
                <input
                  type="password"
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-cream/[0.04] border border-cream/[0.08] text-cream text-sm font-sans focus:outline-none focus:border-lime/30 transition-colors"
                />
              </div>
            ))}

            {error && (
              <p className="font-mono text-[9px] text-red-400/70 tracking-wide">{error}</p>
            )}

            {saved && (
              <p className="font-mono text-[9px] text-lime/70 tracking-wide">✓ Passwort erfolgreich geändert.</p>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="px-8 py-3.5 rounded-full bg-lime text-bg font-sans font-bold text-sm hover:scale-105 active:scale-95 transition-transform"
              >
                Passwort aktualisieren
              </button>
            </div>
          </form>
        </div>

        <div className="mt-4 p-4 rounded-xl border border-cream/[0.06] bg-cream/[0.01]">
          <p className="font-mono text-[9px] text-cream/20 tracking-wide leading-relaxed">
            Mindestens 8 Zeichen · Groß- und Kleinbuchstaben · Zahlen empfohlen
          </p>
        </div>
      </div>
    </div>
  )
}
