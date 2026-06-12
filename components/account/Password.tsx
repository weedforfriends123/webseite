"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/lib/hooks/useUser"

const TEXT  = "#35383f"
const MUTED = "rgba(53,56,63,0.55)"
const DIM   = "rgba(53,56,63,0.10)"

const IS  = { background: "rgba(255,255,255,0.72)", border: "1.5px solid rgba(53,56,63,0.18)", color: TEXT, boxShadow: "inset 0 1px 2px rgba(53,56,63,0.04)", fontSize: "max(16px, 0.875rem)" } as React.CSSProperties
const IFS = { background: "rgba(255,255,255,0.96)", border: "1.5px solid rgba(53,56,63,0.50)", color: TEXT, outline: "none", boxShadow: "0 0 0 3px rgba(53,56,63,0.07)", fontSize: "max(16px, 0.875rem)" } as React.CSSProperties

interface Props { user: User | null; profile: Profile | null; signOut: () => void }

export function Password({ }: Props) {
  const supabase = createClient()
  const [foc,      setFoc]    = useState("")
  const [curr,     setCurr]   = useState("")
  const [newPass,  setNew]    = useState("")
  const [confirm,  setConf]   = useState("")
  const [busy,     setBusy]   = useState(false)
  const [msg,      setMsg]    = useState("")
  const [isErr,    setIsErr]  = useState(false)

  const cls = "w-full px-5 py-4 rounded-xl placeholder:opacity-40 font-ekstra"

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPass !== confirm) { setMsg("Passwörter stimmen nicht überein."); setIsErr(true); return }
    if (newPass.length < 6)  { setMsg("Mindestens 6 Zeichen."); setIsErr(true); return }
    setBusy(true); setMsg("")

    const { error } = await supabase.auth.updateUser({ password: newPass })
    setBusy(false)
    if (error) { setMsg(error.message); setIsErr(true) }
    else { setMsg("Passwort erfolgreich geändert."); setIsErr(false); setCurr(""); setNew(""); setConf("") }
  }

  return (
    <div className="space-y-10">
      <div>
        <p className="font-ekstra uppercase mb-2" style={{ fontSize: 11, letterSpacing: "0.30em", color: "rgba(53,56,63,0.40)" }}>Konto</p>
        <h1 className="font-druk-wide uppercase leading-none" style={{ fontSize: "clamp(1.1rem, 4.5vw, 4rem)", color: TEXT }}>Passwort ändern</h1>
      </div>

      <div style={{ maxWidth: 480, padding: "clamp(22px,3vh,32px)", borderRadius: 18, background: "rgba(255,255,255,0.42)", border: "1px solid rgba(255,255,255,0.68)" }}>
        <form onSubmit={submit} className="space-y-5">

          <div className="flex flex-col gap-2">
            <label className="font-ekstra uppercase" style={{ fontSize: 10, letterSpacing: "0.28em", color: MUTED }}>Neues Passwort</label>
            <input type="password" required value={newPass} placeholder="Mindestens 6 Zeichen"
              minLength={6}
              onChange={e => setNew(e.target.value)}
              onFocus={() => setFoc("np")} onBlur={() => setFoc("")}
              className={cls} style={foc === "np" ? IFS : IS} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-ekstra uppercase" style={{ fontSize: 10, letterSpacing: "0.28em", color: MUTED }}>Passwort bestätigen</label>
            <input type="password" required value={confirm} placeholder="Passwort wiederholen"
              onChange={e => setConf(e.target.value)}
              onFocus={() => setFoc("cf")} onBlur={() => setFoc("")}
              className={cls} style={foc === "cf" ? IFS : IS} />
          </div>

          {msg && (
            <p className="font-ekstra" style={{ fontSize: "0.88rem", color: isErr ? "#c0392b" : "#4a5f46" }}>{msg}</p>
          )}

          <div style={{ height: 1, background: DIM }} />

          <button
            type="submit" disabled={busy}
            className="w-full py-4 font-ekstra uppercase rounded-full transition-all duration-200 disabled:opacity-40"
            style={{ background: TEXT, color: "#e8e4dc", letterSpacing: "0.22em", fontSize: 13 }}
          >
            {busy ? "Speichern…" : "Passwort speichern"}
          </button>
        </form>
      </div>
    </div>
  )
}
