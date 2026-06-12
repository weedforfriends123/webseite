"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/lib/hooks/useUser"

const TEXT   = "#35383f"
const MUTED  = "rgba(53,56,63,0.55)"
const ACCENT = "#eddc8c"
const DIM    = "rgba(53,56,63,0.10)"

const STEPS = [
  {
    id: "front",
    title: "Vorderseite",
    label: "Ausweis Vorderseite",
    desc: "Halte die Vorderseite deines Personalausweises oder Reisepasses gerade in die Kamera.",
    camera: "environment" as const,
    aspect: "4/3",
    guide: "id",
  },
  {
    id: "back",
    title: "Rückseite",
    label: "Ausweis Rückseite",
    desc: "Drehe den Ausweis um und halte die Rückseite gerade in die Kamera.",
    camera: "environment" as const,
    aspect: "4/3",
    guide: "id",
  },
  {
    id: "selfie",
    title: "Selfie",
    label: "Selfie",
    desc: "Schau direkt in die Frontkamera. Halte dein Gesicht im Rahmen.",
    camera: "user" as const,
    aspect: "3/4",
    guide: "face",
  },
]

type Phase = "consent" | "capture" | "reviewing"

interface Props { user: User | null; profile: Profile | null; signOut: () => void }

export function AgeVerification({ user }: Props) {
  const isVerified = user?.user_metadata?.age_verified === true

  const videoRef       = useRef<HTMLVideoElement>(null)
  const canvasRef      = useRef<HTMLCanvasElement>(null)
  const streamRef      = useRef<MediaStream | null>(null)
  const prevFacingRef  = useRef<"user" | "environment" | null>(null)
  const tokenRef       = useRef(0)

  const [phase, setPhase]         = useState<Phase>("consent")
  const [consented, setConsented] = useState(false)
  const [step, setStep]           = useState(0)
  const [captures, setCaptures]   = useState<string[]>([])
  const [preview, setPreview]     = useState<string | null>(null)
  const [streaming, setStreaming] = useState(false)
  const [cameraErr, setCameraErr] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified]   = useState(false)
  const [verifyErr, setVerifyErr] = useState("")

  const stopStream = useCallback(() => {
    tokenRef.current++
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    prevFacingRef.current = null
    setStreaming(false)
  }, [])

  // Cleanup on unmount
  useEffect(() => () => { stopStream() }, [stopStream])

  const startCamera = useCallback(async (facing: "user" | "environment") => {
    // Same camera already running — reattach and continue
    if (prevFacingRef.current === facing && streamRef.current?.active) {
      if (videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = streamRef.current
        await videoRef.current.play().catch(() => {})
      }
      setStreaming(true)
      return
    }

    const token = ++tokenRef.current

    // Stop existing stream before requesting new one
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
      prevFacingRef.current = null
      setStreaming(false)
      // Give iOS time to release the hardware
      await new Promise(r => setTimeout(r, 220))
    }

    if (token !== tokenRef.current) return

    setCameraErr("")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 960 } },
      })
      if (token !== tokenRef.current) {
        stream.getTracks().forEach(t => t.stop())
        return
      }
      streamRef.current = stream
      prevFacingRef.current = facing
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => {})
      }
      setStreaming(true)
    } catch {
      if (token === tokenRef.current) {
        setCameraErr("Kamera-Zugriff verweigert. Bitte erlaube den Kamera-Zugriff in deinen Browser-Einstellungen.")
      }
    }
  }, [])

  const startVerification = () => {
    setPhase("capture")
    setStep(0)
    setCaptures([])
    setPreview(null)
    setVerifyErr("")
    startCamera(STEPS[0].camera)
  }

  const capture = () => {
    const video  = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width  = video.videoWidth  || 1280
    canvas.height = video.videoHeight || 960
    canvas.getContext("2d")!.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL("image/jpeg", 0.88)
    setPreview(dataUrl)
    stopStream()
  }

  const retake = () => {
    setPreview(null)
    startCamera(STEPS[step].camera)
  }

  const confirm = () => {
    const base64     = preview!.split(",")[1]
    const newCaptures = [...captures, base64]
    setCaptures(newCaptures)
    setPreview(null)

    const nextStep = step + 1
    if (nextStep < STEPS.length) {
      setStep(nextStep)
      // Explicit call — no useEffect dependency on step
      startCamera(STEPS[nextStep].camera)
    } else {
      stopStream()
      setPhase("reviewing")
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
        setVerifyErr(data.error ?? "Verifizierung fehlgeschlagen. Bitte versuche es erneut mit besserer Beleuchtung.")
        // Reset so user can try again
        setCaptures([])
        setStep(0)
        setPhase("capture")
        startCamera(STEPS[0].camera)
      }
    } catch {
      setVerifyErr("Netzwerkfehler. Bitte versuche es erneut.")
    }
    setVerifying(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="font-ekstra uppercase mb-2" style={{ fontSize: 11, letterSpacing: "0.30em", color: "rgba(53,56,63,0.40)" }}>Sicherheit</p>
        <h1 className="font-druk-wide uppercase leading-none" style={{ fontSize: "clamp(0.85rem, 3.6vw, 4rem)", color: TEXT }}>
          Altersverifizierung
        </h1>
      </div>

      {/* ── Already verified ── */}
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
            <p className="font-druk-wide uppercase" style={{ fontSize: "1rem", color: TEXT }}>Verifiziert</p>
            <p className="font-ekstra mt-1" style={{ fontSize: "0.88rem", color: MUTED }}>
              Deine Identität wurde erfolgreich verifiziert.
            </p>
          </div>
        </motion.div>

      ) : (
        <AnimatePresence mode="wait">

          {/* ── PHASE: CONSENT ── */}
          {phase === "consent" && (
            <motion.div
              key="consent"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
              {/* Intro card */}
              <div style={{ padding: "clamp(18px,3vh,28px)", borderRadius: 18, background: "rgba(255,255,255,0.42)", border: "1px solid rgba(255,255,255,0.68)" }}>
                <p className="font-druk-wide uppercase mb-3" style={{ fontSize: "clamp(0.8rem, 2.8vw, 1.1rem)", color: TEXT }}>
                  So funktioniert es
                </p>
                <div className="space-y-3">
                  {STEPS.map((s, i) => (
                    <div key={s.id} className="flex items-start gap-3">
                      <div className="shrink-0 flex items-center justify-center" style={{
                        width: 24, height: 24, borderRadius: "50%",
                        background: "rgba(255,255,255,0.72)", border: `1px solid ${TEXT}`, marginTop: 1,
                      }}>
                        <span className="font-druk-wide" style={{ fontSize: "0.55rem", color: TEXT }}>{i + 1}</span>
                      </div>
                      <div>
                        <p className="font-druk-wide uppercase" style={{ fontSize: "0.78rem", color: TEXT }}>{s.title}</p>
                        <p className="font-ekstra" style={{ fontSize: "0.82rem", color: MUTED, lineHeight: 1.5 }}>{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DSGVO consent */}
              <label
                style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer",
                  padding: "clamp(14px,2vh,20px)", borderRadius: 14, background: DIM }}
              >
                <div
                  onClick={() => setConsented(v => !v)}
                  style={{
                    width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                    background: consented ? TEXT : "rgba(255,255,255,0.72)",
                    border: `1.5px solid ${consented ? TEXT : "rgba(53,56,63,0.35)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.18s ease",
                  }}
                >
                  {consented && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#e8e4dc" strokeWidth="2" strokeLinecap="round">
                      <polyline points="10 3 5 9 2 6" />
                    </svg>
                  )}
                </div>
                <p className="font-ekstra" style={{ fontSize: "0.82rem", color: TEXT, lineHeight: 1.6 }} onClick={() => setConsented(v => !v)}>
                  Ich bestätige, dass die bereitgestellten Dokumente echt sind und mir gehören. Ich bin damit einverstanden, dass meine Bilddaten ausschließlich zur Altersverifizierung temporär verarbeitet und <strong>nicht dauerhaft gespeichert</strong> werden.
                </p>
              </label>

              <button
                disabled={!consented}
                onClick={startVerification}
                className="w-full py-4 font-ekstra uppercase rounded-full transition-all duration-200 disabled:opacity-35"
                style={{ background: TEXT, color: "#e8e4dc", fontSize: 13, letterSpacing: "0.20em" }}
              >
                Verifizierung starten
              </button>

              {verifyErr && (
                <p className="font-ekstra text-center" style={{ fontSize: "0.82rem", color: "#c0392b" }}>{verifyErr}</p>
              )}
            </motion.div>
          )}

          {/* ── PHASE: CAPTURE ── */}
          {phase === "capture" && (
            <motion.div
              key="capture"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
              {/* Step indicators */}
              <div className="flex items-center gap-2">
                {STEPS.map((s, i) => {
                  const done   = captures.length > i
                  const active = step === i
                  return (
                    <div key={s.id} className="flex items-center gap-2 min-w-0" style={{ flex: i < STEPS.length - 1 ? 1 : "unset" }}>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="flex items-center justify-center shrink-0" style={{
                          width: 26, height: 26, borderRadius: "50%",
                          background: done ? TEXT : active ? "rgba(255,255,255,0.80)" : DIM,
                          border: `1.5px solid ${done || active ? TEXT : "transparent"}`,
                          transition: "all 0.3s ease",
                        }}>
                          {done ? (
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#e8e4dc" strokeWidth="2.5" strokeLinecap="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <span className="font-druk-wide" style={{ fontSize: "0.58rem", color: active ? TEXT : MUTED }}>{i + 1}</span>
                          )}
                        </div>
                        <span className="font-ekstra hidden sm:block" style={{ fontSize: "0.8rem", color: active ? TEXT : MUTED, whiteSpace: "nowrap" }}>
                          {s.title}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div style={{ flex: 1, height: 1, background: done ? TEXT : DIM, transition: "background 0.3s" }} />
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Camera card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                  style={{ borderRadius: 18, overflow: "hidden", background: "rgba(255,255,255,0.42)", border: "1px solid rgba(255,255,255,0.68)" }}
                >
                  {/* Step header */}
                  <div style={{ padding: "clamp(16px,2.5vh,24px)" }}>
                    <p className="font-ekstra uppercase mb-1" style={{ fontSize: 10, letterSpacing: "0.28em", color: MUTED }}>
                      Schritt {step + 1} von {STEPS.length}
                    </p>
                    <p className="font-druk-wide uppercase" style={{ fontSize: "clamp(0.85rem, 3vw, 1.3rem)", color: TEXT, marginBottom: 4 }}>
                      {STEPS[step].title}
                    </p>
                    <p className="font-ekstra" style={{ fontSize: "0.86rem", color: MUTED, lineHeight: 1.5 }}>
                      {STEPS[step].desc}
                    </p>
                  </div>

                  {/* Camera viewport */}
                  <div style={{
                    position: "relative", background: "#111",
                    aspectRatio: STEPS[step].aspect,
                    overflow: "hidden",
                    maxHeight: STEPS[step].id === "selfie" ? 420 : "none",
                  }}>
                    {cameraErr ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-6">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.5">
                          <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                          <circle cx="12" cy="13" r="4" />
                        </svg>
                        <p className="font-ekstra" style={{ fontSize: "0.82rem", color: MUTED, lineHeight: 1.5 }}>{cameraErr}</p>
                        <button
                          onClick={() => startCamera(STEPS[step].camera)}
                          className="font-ekstra uppercase py-2 px-5 rounded-full"
                          style={{ background: "rgba(255,255,255,0.20)", color: MUTED, fontSize: 11, letterSpacing: "0.18em", border: `1px solid ${MUTED}` }}
                        >
                          Erneut versuchen
                        </button>
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
                          {STEPS[step].guide === "id" ? (
                            <div style={{
                              width: "78%", height: "60%", borderRadius: 10,
                              border: "2px solid rgba(237,220,140,0.75)",
                              boxShadow: "0 0 0 9999px rgba(0,0,0,0.38)",
                            }} />
                          ) : (
                            <div style={{
                              width: "56%", aspectRatio: "2/3", borderRadius: 999,
                              border: "2px solid rgba(237,220,140,0.75)",
                              boxShadow: "0 0 0 9999px rgba(0,0,0,0.38)",
                            }} />
                          )}
                        </div>
                        {!streaming && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="w-7 h-7 rounded-full border-2 border-[#e8e4dc] border-t-transparent animate-spin" />
                          </div>
                        )}
                      </>
                    )}
                    <canvas ref={canvasRef} style={{ display: "none" }} />
                  </div>

                  {/* Action buttons */}
                  <div style={{ padding: "clamp(12px,2vh,20px)", display: "flex", gap: 10 }}>
                    {preview ? (
                      <>
                        <button
                          onClick={retake}
                          className="flex-1 py-3 font-ekstra uppercase rounded-full"
                          style={{ background: "rgba(255,255,255,0.60)", border: `1px solid ${TEXT}`, color: TEXT, fontSize: 12, letterSpacing: "0.16em" }}
                        >
                          Wiederholen
                        </button>
                        <button
                          onClick={confirm}
                          className="flex-1 py-3 font-ekstra uppercase rounded-full"
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
              </AnimatePresence>
            </motion.div>
          )}

          {/* ── PHASE: REVIEWING ── */}
          {phase === "reviewing" && (
            <motion.div
              key="reviewing"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
              <div style={{ padding: "clamp(20px,3vh,30px)", borderRadius: 18, background: "rgba(255,255,255,0.42)", border: "1px solid rgba(255,255,255,0.68)" }}
                className="flex flex-col items-center gap-5 text-center">
                {/* Thumbnails */}
                <div className="flex gap-3 w-full">
                  {captures.map((cap, i) => (
                    <div key={i} style={{
                      flex: 1,
                      aspectRatio: i < 2 ? "4/3" : "3/4",
                      borderRadius: 10, overflow: "hidden", border: `1px solid ${DIM}`,
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`data:image/jpeg;base64,${cap}`} alt={STEPS[i].label}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ))}
                </div>

                <div>
                  <p className="font-druk-wide uppercase" style={{ fontSize: "clamp(0.85rem, 2.5vw, 1.05rem)", color: TEXT }}>
                    Bereit zur Prüfung
                  </p>
                  <p className="font-ekstra mt-1.5" style={{ fontSize: "0.82rem", color: MUTED, lineHeight: 1.5 }}>
                    Deine Fotos werden von unserer KI geprüft.<br />Dies dauert nur wenige Sekunden.
                  </p>
                </div>

                {verifyErr && (
                  <p className="font-ekstra" style={{ fontSize: "0.82rem", color: "#c0392b" }}>{verifyErr}</p>
                )}

                <div className="flex flex-col gap-3 w-full">
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
                  <button
                    onClick={() => { setCaptures([]); setStep(0); setPhase("capture"); startCamera(STEPS[0].camera) }}
                    disabled={verifying}
                    className="w-full py-3 font-ekstra uppercase rounded-full"
                    style={{ background: "transparent", border: `1px solid rgba(53,56,63,0.25)`, color: MUTED, fontSize: 11, letterSpacing: "0.18em" }}
                  >
                    Fotos neu aufnehmen
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      )}

      {/* Info box — always shown unless verified */}
      {!isVerified && !verified && (
        <div style={{ padding: "clamp(14px,2vh,20px)", borderRadius: 14, background: DIM }}>
          <p className="font-ekstra" style={{ fontSize: "0.80rem", color: MUTED, lineHeight: 1.6 }}>
            <strong style={{ color: TEXT }}>Warum ist das notwendig?</strong><br />
            Wir sind gesetzlich verpflichtet, das Alter unserer Kunden zu verifizieren. Deine Bilddaten werden ausschließlich zur Altersüberprüfung genutzt und <strong style={{ color: TEXT }}>nicht dauerhaft gespeichert</strong>.
          </p>
        </div>
      )}
    </div>
  )
}
