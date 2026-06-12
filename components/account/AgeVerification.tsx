"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/lib/hooks/useUser"

const TEXT  = "#35383f"
const MUTED = "rgba(53,56,63,0.55)"
const ACCENT = "#eddc8c"
const DIM   = "rgba(53,56,63,0.10)"

const STEPS = [
  {
    id: "front",
    title: "Vorderseite",
    desc: "Halte die Vorderseite deines Personalausweises oder Reisepasses in die Kamera.",
    camera: "environment" as const,
  },
  {
    id: "back",
    title: "Rückseite",
    desc: "Drehe den Ausweis um und halte die Rückseite in die Kamera.",
    camera: "environment" as const,
  },
  {
    id: "selfie",
    title: "Selfie",
    desc: "Schau direkt in die Kamera für ein klares Selfie von dir.",
    camera: "user" as const,
  },
]

interface Props { user: User | null; profile: Profile | null; signOut: () => void }

export function AgeVerification({ user }: Props) {
  const isVerified = user?.user_metadata?.age_verified === true

  const videoRef   = useRef<HTMLVideoElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const streamRef  = useRef<MediaStream | null>(null)

  const [step, setStep]           = useState(0)
  const [captures, setCaptures]   = useState<string[]>([])
  const [preview, setPreview]     = useState<string | null>(null)
  const [streaming, setStreaming] = useState(false)
  const [cameraErr, setCameraErr] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified]   = useState(false)
  const [verifyErr, setVerifyErr] = useState("")

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setStreaming(false)
  }, [])

  const startCamera = useCallback(async (facing: "user" | "environment") => {
    stopStream()
    setCameraErr("")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setStreaming(true)
    } catch {
      setCameraErr("Kamera-Zugriff verweigert. Bitte erlaube den Kamera-Zugriff in deinen Browser-Einstellungen.")
    }
  }, [stopStream])

  useEffect(() => {
    if (!isVerified && !preview) {
      startCamera(STEPS[step].camera)
    }
    return () => { stopStream() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  useEffect(() => {
    return () => stopStream()
  }, [stopStream])

  const capture = () => {
    const video  = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width  = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext("2d")!.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92)
    setPreview(dataUrl)
    stopStream()
  }

  const retake = () => {
    setPreview(null)
    startCamera(STEPS[step].camera)
  }

  const confirm = () => {
    const base64 = preview!.split(",")[1]
    setCaptures(prev => [...prev, base64])
    setPreview(null)
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    }
  }

  const verify = async () => {
    if (captures.length < 3) return
    setVerifying(true)
    setVerifyErr("")
    try {
      const res = await fetch("/api/verify-age", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frontId: captures[0], backId: captures[1], selfie: captures[2] }),
      })
      const data = await res.json()
      if (data.verified) {
        setVerified(true)
      } else {
        setVerifyErr(data.error ?? "Verifizierung fehlgeschlagen. Bitte versuche es erneut.")
        setCaptures([])
        setStep(0)
        startCamera(STEPS[0].camera)
      }
    } catch {
      setVerifyErr("Netzwerkfehler. Bitte versuche es erneut.")
    }
    setVerifying(false)
  }

  const allCaptured = captures.length === STEPS.length

  return (
    <div className="space-y-8">
      <div>
        <p className="font-ekstra uppercase mb-2" style={{ fontSize: 11, letterSpacing: "0.30em", color: "rgba(53,56,63,0.40)" }}>Sicherheit</p>
        <h1 className="font-druk-wide uppercase leading-none" style={{ fontSize: "clamp(0.85rem, 3.6vw, 4rem)", color: TEXT }}>
          Altersverifizierung
        </h1>
      </div>

      {/* Already verified (from Supabase) or just verified this session */}
      {(isVerified || verified) ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ padding: "clamp(24px,4vh,36px)", borderRadius: 18, background: "rgba(255,255,255,0.42)", border: "1px solid rgba(255,255,255,0.68)" }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: TEXT, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e8e4dc" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <p className="font-druk-wide uppercase" style={{ fontSize: "1rem", color: TEXT }}>
              {verified && !isVerified ? "Erfolgreich verifiziert" : "Verifiziert"}
            </p>
            <p className="font-ekstra mt-1" style={{ fontSize: "0.88rem", color: MUTED }}>
              Deine Identität wurde erfolgreich verifiziert.
            </p>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Step indicators */}
          <div className="flex items-center gap-3">
            {STEPS.map((s, i) => {
              const done = captures.length > i
              const active = step === i && !allCaptured
              return (
                <div key={s.id} className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: done ? TEXT : active ? "rgba(255,255,255,0.72)" : DIM,
                      border: `1.5px solid ${done || active ? TEXT : "transparent"}`,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {done ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e8e4dc" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <span className="font-druk-wide" style={{ fontSize: "0.6rem", color: active ? TEXT : MUTED }}>{i + 1}</span>
                    )}
                  </div>
                  <span className="font-ekstra" style={{ fontSize: "0.82rem", color: active ? TEXT : MUTED }}>{s.title}</span>
                  {i < STEPS.length - 1 && (
                    <div style={{ flex: 1, height: 1, background: DIM, minWidth: 12 }} />
                  )}
                </div>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            {!allCaptured && (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                style={{ borderRadius: 18, overflow: "hidden", background: "rgba(255,255,255,0.42)", border: "1px solid rgba(255,255,255,0.68)" }}
              >
                <div style={{ padding: "clamp(18px,3vh,28px)" }}>
                  <p className="font-ekstra uppercase mb-1" style={{ fontSize: 10, letterSpacing: "0.28em", color: MUTED }}>
                    Schritt {step + 1} von {STEPS.length}
                  </p>
                  <p className="font-druk-wide uppercase" style={{ fontSize: "clamp(0.85rem, 3vw, 1.4rem)", color: TEXT, marginBottom: 6 }}>
                    {STEPS[step].title}
                  </p>
                  <p className="font-ekstra" style={{ fontSize: "0.88rem", color: MUTED, lineHeight: 1.5 }}>
                    {STEPS[step].desc}
                  </p>
                </div>

                {/* Camera / preview area */}
                <div style={{ position: "relative", background: "#1a1a1a", aspectRatio: "16/9", overflow: "hidden" }}>
                  {cameraErr ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-6">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.5">
                        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                      <p className="font-ekstra" style={{ fontSize: "0.82rem", color: MUTED }}>{cameraErr}</p>
                    </div>
                  ) : preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="Aufnahme" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      {/* Guide overlay */}
                      <div aria-hidden style={{
                        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                        pointerEvents: "none",
                      }}>
                        {STEPS[step].id !== "selfie" ? (
                          <div style={{
                            width: "72%", height: "54%", borderRadius: 8,
                            border: "2px solid rgba(237,220,140,0.7)",
                            boxShadow: "0 0 0 9999px rgba(0,0,0,0.35)",
                          }} />
                        ) : (
                          <div style={{
                            width: "52%", aspectRatio: "3/4", borderRadius: 999,
                            border: "2px solid rgba(237,220,140,0.7)",
                            boxShadow: "0 0 0 9999px rgba(0,0,0,0.35)",
                          }} />
                        )}
                      </div>
                    </>
                  )}
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                </div>

                {/* Action buttons */}
                <div style={{ padding: "clamp(14px,2.5vh,22px)", display: "flex", gap: 10 }}>
                  {preview ? (
                    <>
                      <button
                        onClick={retake}
                        className="flex-1 py-3 font-ekstra uppercase rounded-full transition-all duration-200"
                        style={{ background: "rgba(255,255,255,0.60)", border: `1px solid ${TEXT}`, color: TEXT, fontSize: 12, letterSpacing: "0.16em" }}
                      >
                        Wiederholen
                      </button>
                      <button
                        onClick={confirm}
                        className="flex-1 py-3 font-ekstra uppercase rounded-full transition-all duration-200"
                        style={{ background: TEXT, color: "#e8e4dc", fontSize: 12, letterSpacing: "0.16em" }}
                      >
                        Bestätigen
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={capture}
                      disabled={!streaming}
                      className="w-full py-3 font-ekstra uppercase rounded-full transition-all duration-200 disabled:opacity-40"
                      style={{ background: ACCENT, color: TEXT, fontSize: 12, letterSpacing: "0.16em" }}
                    >
                      Foto aufnehmen
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* All captured — verify button */}
          {allCaptured && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ padding: "clamp(22px,3.5vh,32px)", borderRadius: 18, background: "rgba(255,255,255,0.42)", border: "1px solid rgba(255,255,255,0.68)" }}
              className="flex flex-col items-center gap-5 text-center"
            >
              <div className="flex gap-3">
                {captures.map((cap, i) => (
                  <div key={i} style={{ flex: 1, aspectRatio: i < 2 ? "3/2" : "2/3", borderRadius: 8, overflow: "hidden", border: `1px solid ${DIM}` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`data:image/jpeg;base64,${cap}`} alt={STEPS[i].title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
              <div>
                <p className="font-druk-wide uppercase" style={{ fontSize: "clamp(0.85rem, 2.5vw, 1.1rem)", color: TEXT }}>Bereit zur Prüfung</p>
                <p className="font-ekstra mt-1.5" style={{ fontSize: "0.82rem", color: MUTED, lineHeight: 1.5 }}>
                  Deine Fotos werden von unserer KI geprüft. Dies dauert nur wenige Sekunden.
                </p>
              </div>
              {verifyErr && (
                <p className="font-ekstra" style={{ fontSize: "0.82rem", color: "#c0392b" }}>{verifyErr}</p>
              )}
              <button
                onClick={verify}
                disabled={verifying}
                className="w-full py-4 font-ekstra uppercase rounded-full transition-all duration-200 disabled:opacity-50"
                style={{ background: TEXT, color: "#e8e4dc", fontSize: 13, letterSpacing: "0.20em" }}
              >
                {verifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border border-[#e8e4dc] border-t-transparent animate-spin" />
                    Wird geprüft…
                  </span>
                ) : "Jetzt verifizieren"}
              </button>
            </motion.div>
          )}

          {verifyErr && !allCaptured && (
            <p className="font-ekstra text-center" style={{ fontSize: "0.82rem", color: "#c0392b" }}>{verifyErr}</p>
          )}

          {/* Info box */}
          <div style={{ padding: "clamp(16px,2.5vh,22px)", borderRadius: 14, background: DIM }}>
            <p className="font-ekstra" style={{ fontSize: "0.82rem", color: MUTED, lineHeight: 1.6 }}>
              <strong style={{ color: TEXT }}>Warum ist das notwendig?</strong><br />
              Wir sind gesetzlich verpflichtet, das Alter unserer Kunden zu verifizieren. Deine Dokumente werden
              ausschließlich zur Altersüberprüfung verwendet und nicht gespeichert.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
