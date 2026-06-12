"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/lib/hooks/useUser"

const TEXT   = "#35383f"
const MUTED  = "rgba(53,56,63,0.55)"
const DIM    = "rgba(53,56,63,0.10)"
const ACCENT = "#eddc8c"

const REWARDS = [
  { name: "5€ Rabatt",    points: 100 },
  { name: "10€ Rabatt",   points: 200 },
  { name: "Gratis Pre-Roll", points: 300 },
  { name: "Gratis Vape",  points: 500 },
]

type LoyaltyEvent = { id: string; type: string; points: number; description: string | null; created_at: string }

interface Props { user: User | null; profile: Profile | null; signOut: () => void }

export function Loyalty({ user, profile }: Props) {
  const supabase = createClient()
  const [events, setEvents] = useState<LoyaltyEvent[]>([])
  const balance = profile?.loyalty_points ?? 0
  const nextTier = 500
  const progress = Math.min((balance / nextTier) * 100, 100)

  useEffect(() => {
    if (!user) return
    supabase.from("loyalty_events").select("*").eq("user_id", user.id)
      .order("created_at", { ascending: false }).limit(20)
      .then(({ data }) => setEvents(data ?? []))
  }, [user])

  return (
    <div className="space-y-8">
      <div>
        <p className="font-ekstra uppercase mb-2" style={{ fontSize: 11, letterSpacing: "0.30em", color: "rgba(53,56,63,0.40)" }}>Konto</p>
        <h1 className="font-druk-wide uppercase leading-none" style={{ fontSize: "clamp(0.85rem, 3.6vw, 4rem)", color: TEXT }}>Treuepunkte</h1>
      </div>

      {/* Balance card */}
      <div
        style={{
          padding: "clamp(24px,4vh,36px)", borderRadius: 18,
          background: "rgba(255,255,255,0.48)", border: `1.5px solid ${ACCENT}`,
          position: "relative", overflow: "hidden",
        }}
      >
        <p className="font-ekstra uppercase mb-3" style={{ fontSize: 10, letterSpacing: "0.26em", color: MUTED }}>
          Aktuelles Guthaben
        </p>
        <div className="flex items-end gap-3 mb-5">
          <span className="font-druk-wide uppercase leading-none" style={{ fontSize: "clamp(3rem, 8vw, 5rem)", color: TEXT }}>{balance}</span>
          <span className="font-ekstra uppercase mb-1.5" style={{ fontSize: "clamp(0.88rem, 1.2vw, 1rem)", color: MUTED }}>WFF Points</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-ekstra" style={{ fontSize: 10, color: MUTED }}>Nächste Stufe: {nextTier} Punkte</span>
          <span className="font-ekstra" style={{ fontSize: 10, color: TEXT }}>{balance} / {nextTier}</span>
        </div>
        <div style={{ height: 4, borderRadius: 9999, background: DIM, overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{ height: "100%", background: ACCENT, borderRadius: 9999 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rewards */}
        <div style={{ padding: "clamp(20px,3vh,28px)", borderRadius: 16, background: "rgba(255,255,255,0.42)", border: "1px solid rgba(255,255,255,0.68)" }}>
          <p className="font-ekstra uppercase mb-5" style={{ fontSize: 10, letterSpacing: "0.28em", color: MUTED }}>Prämien einlösen</p>
          <div className="space-y-3">
            {REWARDS.map((r) => {
              const ok = balance >= r.points
              return (
                <div
                  key={r.name}
                  className="flex items-center justify-between p-3.5 rounded-xl transition-all"
                  style={{ background: ok ? "rgba(255,255,255,0.60)" : "rgba(255,255,255,0.28)", border: `1px solid ${ok ? "rgba(237,220,140,0.50)" : DIM}`, opacity: ok ? 1 : 0.55 }}
                >
                  <div>
                    <p className="font-druk-wide uppercase" style={{ fontSize: "0.88rem", color: TEXT }}>{r.name}</p>
                    <p className="font-ekstra uppercase mt-0.5" style={{ fontSize: 9, letterSpacing: "0.18em", color: MUTED }}>{r.points} Punkte</p>
                  </div>
                  <button
                    disabled={!ok}
                    className="font-ekstra uppercase rounded-full transition-all duration-150"
                    style={{
                      padding: "8px 18px", fontSize: 11, letterSpacing: "0.18em",
                      background: ok ? TEXT : "rgba(53,56,63,0.10)",
                      color: ok ? "#e8e4dc" : MUTED,
                      cursor: ok ? "pointer" : "not-allowed",
                    }}
                  >
                    {ok ? "Einlösen" : "Bald"}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* History */}
        <div style={{ padding: "clamp(20px,3vh,28px)", borderRadius: 16, background: "rgba(255,255,255,0.42)", border: "1px solid rgba(255,255,255,0.68)" }}>
          <p className="font-ekstra uppercase mb-5" style={{ fontSize: 10, letterSpacing: "0.28em", color: MUTED }}>Punktehistorie</p>
          {events.length === 0 ? (
            <p className="font-ekstra" style={{ fontSize: "0.88rem", color: MUTED }}>Noch keine Ereignisse.</p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {events.map((e, i) => (
                <div key={e.id} className="flex items-center justify-between py-2.5" style={{ borderBottom: `1px solid ${DIM}` }}>
                  <div className="min-w-0">
                    <p className="font-ekstra truncate" style={{ fontSize: "0.82rem", color: TEXT }}>
                      {e.description || e.type}
                    </p>
                    <p className="font-ekstra mt-0.5" style={{ fontSize: 9, color: MUTED }}>
                      {new Date(e.created_at).toLocaleDateString("de-DE")}
                    </p>
                  </div>
                  <span
                    className="font-druk-wide shrink-0 ml-3"
                    style={{ fontSize: "0.92rem", color: e.points > 0 ? "#4a5f46" : "#c0392b" }}
                  >
                    {e.points > 0 ? "+" : ""}{e.points}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
