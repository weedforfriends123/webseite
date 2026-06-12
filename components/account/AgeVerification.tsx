"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/lib/hooks/useUser"
import { createClient } from "@/lib/supabase/client"

const TEXT   = "#35383f"
const MUTED  = "rgba(53,56,63,0.55)"
const ACCENT = "#eddc8c"
const DIM    = "rgba(53,56,63,0.10)"

const STEPS = [
  {
    id: "front",
    title: "Vorderseite",
    desc: "Halte die Vorderseite deines Ausweises oder Reisepasses gerade in die Kamera.",
    camera: "environment" as const,
    aspect: "4/3" as const,
    guide: "id" as const,
  },
  {
    id: "back",
    title: "Rückseite",
    desc: "Drehe den Ausweis um — Rückseite gut lesbar in die Kamera.",
    camera: "environment" as const,
    aspect: "4/3" as const,
    guide: "id" as const,
  },
  {
    id: "selfie",
    title: "Selfie",
    desc: "Schau direkt in die Kamera und halte dein Gesicht im Rahmen.",
    camera: "user" as const,
    aspect: "3/4" as const,
    guide: "face" as const,
  },
]

type Phase = "consent" | "capture" | "reviewing"

interface Props { user: User | null; profile: Profile | null; signOut: () => void }

export function AgeVerification({ user }: Props) {
  const isVerified = user?.user_metadata?.age_verified === true

  const supabase   = createClient()
  const videoRef   = useRef<HTMLVideoElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const streamRef  = useRef<MediaStream | null>(null)
  const facingRef  = useRef<"user" | "environment" | null>(null)
  const tokenRef   = useRef(0)

  const [phase, setPhase]         = useState<Phase>("consent")
  const [consented, setConsented] = useState(false)
  const [step, setStep]           = useState(0)
  const [captures, setCaptures]   = useState<string[]>([])
  const [preview, setPreview]     = useState<string | null>(null)
  const [flash, setFlash]         = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [cameraErr, setCameraErr] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified]   = useState(false)
  const [verifyErr, setVerifyErr] = useState("")

  const stopStream = useCallback(() => {
    tokenRef.current++
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    facingRef.current = null
    setStreaming(false)
  }, [])

  useEffect(() => () => { stopStream() }, [stopStream])

  const startCamera = useCallback(async (facing: "user" | "environment") => {
    // Same camera still running — just make sure video is attached
    if (facingRef.current === facing && streamRef.current?.active) {
      if (videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = streamRef.current
        await videoRef.current.play().catch(() => {})
      }
      setStreaming(true)
      return
    }

    const token = ++tokenRef.current

    // Switch or cold start — stop existing stream first
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
      facingRef.current = null
      setStreaming(false)
      // iOS needs a moment to release the hardware before a new request
      await new Promise(r => setTimeout(r, 250))
    }

    if (token !== tokenRef.current) return

    setCameraErr("")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facing }, width: { ideal: 1920 }, height: { ideal: 1440 } },
      })
      if (token !== tokenRef.current) { stream.getTracks().forEach(t => t.stop()); return }

      streamRef.current = stream
      facingRef.current = facing

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => {})
      }
      setStreaming(true)
    } catch {
      if (token !== tokenRef.current) return
      setCameraErr("Kamera-Zugriff verweigert. Bitte erlaube den Kamera-Zugriff in deinen Browser-Einstellungen.")
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

  // Capture: snapshot to canvas but keep the stream running for instant retake
  const capture = () => {
    const video  = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || !streaming) return

    canvas.width  = video.videoWidth  || 1280
    canvas.height = video.videoHeight || 960
    canvas.getContext("2d")!.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL("image/jpeg", 0.88)

    // Brief white flash to signal capture
    setFlash(true)
    setTimeout(() => setFlash(false), 280)
    setPreview(dataUrl)
    // Stream stays alive — retake is instant, no permission re-request needed
  }

  // Retake: clear preview, stream already running
  const retake = () => {
    setPreview(null)
    // If stream somehow died (e.g. iOS backgrounded), restart it
    if (!streamRef.current?.active) {
      startCamera(STEPS[step].camera)
    }
  }

  // Confirm: save capture and advance to next step
  const confirm = () => {
    const base64      = preview!.split(",")[1]
    const newCaptures = [...captures, base64]
    setCaptures(newCaptures)
    setPreview(null)

    const nextStep = step + 1
    if (nextStep < STEPS.length) {
      setStep(nextStep)
      // startCamera reuses the running stream if facing mode is the same;
      // if switching to selfie (environment→user), stops and restarts with 250ms delay
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
        // Refresh the client JWT so useUser's onAuthStateChange fires with age_verified=true
        await supabase.auth.refreshSession()
        setVerified(true)
      } else {
        setVerifyErr(data.error ?? "Verifizierung fehlgeschlagen. Bitte erneut versuchen.")
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

  // ─── UI ─────────────────────────────────────────────────────────────────────

  if (isVerified || verified) {
    return (
      <div className="space-y-8">
        <Heading />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ padding: "clamp(28px,5vh,44px)", borderRadius: 20, background: "rgba(255,255,255,0.42)", border: "1px solid rgba(255,255,255,0.68)" }}
          className="flex flex-col items-center gap-5 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 20 }}
            style={{ width: 64, height: 64, borderRadius: "50%", background: TEXT, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#e8e4dc" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>
          <div>
            <p className="font-druk-wide uppercase" style={{ fontSize: "1.05rem", color: TEXT, letterSpacing: "-0.01em" }}>Verifiziert</p>
            <p className="font-ekstra mt-1.5" style={{ fontSize: "0.88rem", color: MUTED, lineHeight: 1.65 }}>
              Deine Identität wurde erfolgreich bestätigt.<br />Du kannst jetzt Bestellungen aufgeben.
            </p>
          </div>
        </motion.div>
        <InfoBox />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Heading />

      <AnimatePresence mode="wait">

        {/* ── CONSENT ─────────────────────────────────────────────────────── */}
        {phase === "consent" && (
          <motion.div key="consent" {...FADE_IN} className="space-y-4">
            {/* Steps overview */}
            <div style={{ padding: "clamp(18px,3vh,26px)", borderRadius: 18, background: "rgba(255,255,255,0.42)", border: "1px solid rgba(255,255,255,0.68)" }}>
              <p className="font-druk-wide uppercase mb-4" style={{ fontSize: "clamp(0.78rem, 2.6vw, 1rem)", color: TEXT }}>So geht's</p>
              <div className="space-y-3.5">
                {STEPS.map((s, i) => (
                  <div key={s.id} className="flex items-start gap-3">
                    <div className="shrink-0 flex items-center justify-center" style={{
                      width: 26, height: 26, borderRadius: "50%",
                      background: "rgba(255,255,255,0.72)", border: `1.5px solid ${TEXT}`, marginTop: 1,
                    }}>
                      <span className="font-druk-wide" style={{ fontSize: "0.57rem", color: TEXT }}>{i + 1}</span>
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
            <label className="flex items-start gap-3 cursor-pointer" style={{ padding: "clamp(14px,2vh,20px)", borderRadius: 14, background: DIM }}>
              <div
                onClick={() => setConsented(v => !v)}
                style={{
                  width: 22, height: 22, borderRadius: 7, flexShrink: 0, marginTop: 1,
                  background: consented ? TEXT : "rgba(255,255,255,0.80)",
                  border: `1.5px solid ${consented ? TEXT : "rgba(53,56,63,0.30)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.18s ease",
                }}
              >
                {consented && (
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#e8e4dc" strokeWidth="2.2" strokeLinecap="round">
                    <polyline points="10 3 5 9 2 6" />
                  </svg>
                )}
              </div>
              <p className="font-ekstra" style={{ fontSize: "0.82rem", color: TEXT, lineHeight: 1.65 }} onClick={() => setConsented(v => !v)}>
                Ich bestätige, dass die Dokumente echt sind und mir gehören. Ich bin einverstanden, dass meine Bilddaten ausschließlich zur Altersüberprüfung temporär verarbeitet und <strong>nicht dauerhaft gespeichert</strong> werden.
              </p>
            </label>

            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={!consented}
              onClick={startVerification}
              className="w-full py-4 font-ekstra uppercase rounded-full transition-opacity duration-200 disabled:opacity-35"
              style={{ background: TEXT, color: "#e8e4dc", fontSize: 13, letterSpacing: "0.22em" }}
            >
              Verifizierung starten
            </motion.button>

            {verifyErr && (
              <p className="font-ekstra text-center" style={{ fontSize: "0.82rem", color: "#c0392b" }}>{verifyErr}</p>
            )}

            <InfoBox />
          </motion.div>
        )}

        {/* ── CAPTURE ─────────────────────────────────────────────────────── */}
        {phase === "capture" && (
          <motion.div key="capture" {...FADE_IN} className="space-y-4">

            {/* Step progress bar */}
            <StepBar step={step} captures={captures} />

            {/* Camera card — no AnimatePresence key on step to avoid card remount */}
            <div style={{ borderRadius: 20, overflow: "hidden", background: "rgba(255,255,255,0.42)", border: "1px solid rgba(255,255,255,0.68)" }}>

              {/* Step header */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`header-${step}`}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -14 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  style={{ padding: "clamp(14px,2.5vh,22px)" }}
                >
                  <p className="font-ekstra uppercase" style={{ fontSize: 10, letterSpacing: "0.30em", color: MUTED, marginBottom: 3 }}>
                    Schritt {step + 1} von {STEPS.length}
                  </p>
                  <p className="font-druk-wide uppercase" style={{ fontSize: "clamp(0.88rem, 3.2vw, 1.3rem)", color: TEXT, lineHeight: 1.1, marginBottom: 4 }}>
                    {STEPS[step].title}
                  </p>
                  <p className="font-ekstra" style={{ fontSize: "0.84rem", color: MUTED, lineHeight: 1.5 }}>
                    {STEPS[step].desc}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* ── CAMERA VIEWPORT ───────────────────────────────────────── */}
              {/* position:relative + aspectRatio on parent; video uses absolute inset:0
                  so height:100% works correctly on iOS Safari */}
              <div style={{
                position: "relative",
                background: "#0a0a0a",
                aspectRatio: STEPS[step].aspect,
                overflow: "hidden",
              }}>
                {cameraErr ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.4">
                      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                    <p className="font-ekstra" style={{ fontSize: "0.82rem", color: MUTED, lineHeight: 1.55 }}>{cameraErr}</p>
                    <button onClick={() => startCamera(STEPS[step].camera)}
                      className="font-ekstra uppercase py-2 px-5 rounded-full"
                      style={{ background: "rgba(255,255,255,0.18)", color: "#d0ccc4", fontSize: 11, letterSpacing: "0.18em", border: "1px solid rgba(255,255,255,0.25)" }}>
                      Erneut versuchen
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Video always rendered — keeps stream attached to DOM element */}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      style={{
                        position: "absolute", inset: 0,
                        width: "100%", height: "100%",
                        objectFit: "cover",
                        // Hidden behind preview image when preview is shown
                        opacity: preview ? 0 : 1,
                        transition: "opacity 0.15s",
                      }}
                    />

                    {/* Capture preview — overlays video, stream stays live for quick retake */}
                    <AnimatePresence>
                      {preview && (
                        <motion.img
                          key="preview"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.18 }}
                          // eslint-disable-next-line @next/next/no-img-element
                          src={preview}
                          alt="Aufnahme"
                          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Guide overlay — only when live */}
                    {!preview && (
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`guide-${step}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          aria-hidden
                          style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}
                        >
                          {STEPS[step].guide === "id" ? (
                            <div style={{
                              width: "80%", height: "62%", borderRadius: 10,
                              border: "2px solid rgba(237,220,140,0.85)",
                              boxShadow: "0 0 0 9999px rgba(0,0,0,0.42)",
                            }}>
                              {/* Corner accents */}
                              {[["0%","0%","-1px","-1px"],["100%","0%","1px","-1px"],["0%","100%","-1px","1px"],["100%","100%","1px","1px"]].map(([l,t,dl,dt], i) => (
                                <div key={i} style={{
                                  position: "absolute", left: l, top: t,
                                  width: 18, height: 18,
                                  borderLeft: `3px solid ${ACCENT}`, borderTop: `3px solid ${ACCENT}`,
                                  borderRadius: 0,
                                  transform: `translate(${dl}, ${dt}) rotate(${[0,90,270,180][i]}deg)`,
                                }} />
                              ))}
                            </div>
                          ) : (
                            <div style={{
                              width: "56%", aspectRatio: "2/3", borderRadius: "50%",
                              border: "2px solid rgba(237,220,140,0.85)",
                              boxShadow: "0 0 0 9999px rgba(0,0,0,0.42)",
                            }} />
                          )}
                        </motion.div>
                      </AnimatePresence>
                    )}

                    {/* Loading spinner while camera initializes */}
                    {!streaming && !preview && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="w-8 h-8 rounded-full border-2 border-[#e8e4dc] border-t-transparent animate-spin" />
                      </div>
                    )}

                    {/* Capture flash */}
                    <AnimatePresence>
                      {flash && (
                        <motion.div
                          key="flash"
                          initial={{ opacity: 0.85 }}
                          animate={{ opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.28 }}
                          style={{ position: "absolute", inset: 0, background: "white", pointerEvents: "none" }}
                        />
                      )}
                    </AnimatePresence>
                  </>
                )}

                <canvas ref={canvasRef} style={{ display: "none" }} />
              </div>

              {/* Action buttons */}
              <div style={{ padding: "clamp(12px,2vh,18px)", display: "flex", gap: 10 }}>
                {preview ? (
                  <>
                    <motion.button whileTap={{ scale: 0.96 }} onClick={retake}
                      className="flex-1 py-3.5 font-ekstra uppercase rounded-full"
                      style={{ background: "rgba(255,255,255,0.65)", border: `1px solid ${TEXT}`, color: TEXT, fontSize: 12, letterSpacing: "0.16em" }}>
                      Wiederholen
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.96 }} onClick={confirm}
                      className="flex-1 py-3.5 font-ekstra uppercase rounded-full"
                      style={{ background: TEXT, color: "#e8e4dc", fontSize: 12, letterSpacing: "0.16em" }}>
                      {step < STEPS.length - 1 ? "Weiter" : "Fertig"}
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileTap={streaming ? { scale: 0.96 } : {}}
                    onClick={capture}
                    disabled={!streaming}
                    className="w-full py-3.5 font-ekstra uppercase rounded-full transition-opacity duration-200 disabled:opacity-40"
                    style={{ background: ACCENT, color: TEXT, fontSize: 12, letterSpacing: "0.18em" }}>
                    Foto aufnehmen
                  </motion.button>
                )}
              </div>
            </div>

          </motion.div>
        )}

        {/* ── REVIEWING ───────────────────────────────────────────────────── */}
        {phase === "reviewing" && (
          <motion.div key="reviewing" {...FADE_IN} className="space-y-4">
            <div style={{ padding: "clamp(20px,3vh,30px)", borderRadius: 20, background: "rgba(255,255,255,0.42)", border: "1px solid rgba(255,255,255,0.68)" }}
              className="flex flex-col items-center gap-5">

              {/* Thumbnails */}
              <div className="flex gap-2.5 w-full">
                {captures.map((cap, i) => (
                  <div key={i} style={{
                    flex: 1, aspectRatio: i < 2 ? "4/3" : "3/4",
                    borderRadius: 10, overflow: "hidden", border: `1px solid ${DIM}`, position: "relative",
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`data:image/jpeg;base64,${cap}`} alt={STEPS[i].title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: 5, left: 0, right: 0, textAlign: "center" }}>
                      <span className="font-ekstra uppercase" style={{
                        fontSize: 8, letterSpacing: "0.18em", color: "#fff",
                        textShadow: "0 1px 4px rgba(0,0,0,0.6)", background: "rgba(0,0,0,0.35)",
                        padding: "2px 6px", borderRadius: 4,
                      }}>{STEPS[i].title}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <p className="font-druk-wide uppercase" style={{ fontSize: "clamp(0.85rem, 2.8vw, 1.05rem)", color: TEXT, letterSpacing: "-0.01em" }}>
                  Bereit zur Prüfung
                </p>
                <p className="font-ekstra mt-1.5" style={{ fontSize: "0.82rem", color: MUTED, lineHeight: 1.6 }}>
                  Deine Fotos werden von unserer KI geprüft.<br />Das dauert nur wenige Sekunden.
                </p>
              </div>

              {verifyErr && (
                <p className="font-ekstra text-center" style={{ fontSize: "0.82rem", color: "#c0392b" }}>{verifyErr}</p>
              )}

              <div className="flex flex-col gap-3 w-full">
                <motion.button whileTap={!verifying ? { scale: 0.97 } : {}}
                  onClick={verify} disabled={verifying}
                  className="w-full py-4 font-ekstra uppercase rounded-full disabled:opacity-50"
                  style={{ background: TEXT, color: "#e8e4dc", fontSize: 13, letterSpacing: "0.22em" }}>
                  {verifying ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border border-[#e8e4dc] border-t-transparent animate-spin" />
                      Wird geprüft…
                    </span>
                  ) : "Jetzt verifizieren"}
                </motion.button>
                <button
                  onClick={() => { setCaptures([]); setStep(0); setPhase("capture"); startCamera(STEPS[0].camera) }}
                  disabled={verifying}
                  className="w-full py-3 font-ekstra uppercase rounded-full"
                  style={{ background: "transparent", border: "1px solid rgba(53,56,63,0.22)", color: MUTED, fontSize: 11, letterSpacing: "0.18em" }}>
                  Fotos neu aufnehmen
                </button>
              </div>
            </div>

            <InfoBox />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Heading() {
  return (
    <div>
      <p className="font-ekstra uppercase mb-2" style={{ fontSize: 11, letterSpacing: "0.30em", color: "rgba(53,56,63,0.40)" }}>Sicherheit</p>
      <h1 className="font-druk-wide uppercase leading-none" style={{ fontSize: "clamp(0.85rem, 3.6vw, 4rem)", color: TEXT }}>
        Altersverifizierung
      </h1>
    </div>
  )
}

function InfoBox() {
  return (
    <div style={{ padding: "clamp(14px,2vh,20px)", borderRadius: 14, background: DIM }}>
      <p className="font-ekstra" style={{ fontSize: "0.80rem", color: MUTED, lineHeight: 1.65 }}>
        <strong style={{ color: TEXT }}>Warum ist das notwendig?</strong><br />
        Wir sind gesetzlich verpflichtet, das Alter unserer Kunden zu verifizieren. Deine Bilddaten werden ausschließlich zur Altersüberprüfung genutzt und <strong style={{ color: TEXT }}>nicht dauerhaft gespeichert</strong>.
      </p>
    </div>
  )
}

function StepBar({ step, captures }: { step: number; captures: string[] }) {
  return (
    <div className="flex items-center gap-1.5">
      {STEPS.map((s, i) => {
        const done   = captures.length > i
        const active = step === i
        return (
          <div key={s.id} className="flex items-center gap-1.5" style={{ flex: i < STEPS.length - 1 ? 1 : "unset" }}>
            <div className="flex items-center gap-1.5 shrink-0">
              <motion.div
                animate={{
                  background: done ? TEXT : active ? "rgba(255,255,255,0.88)" : "rgba(53,56,63,0.12)",
                  borderColor: done || active ? TEXT : "transparent",
                }}
                transition={{ duration: 0.25 }}
                className="flex items-center justify-center shrink-0"
                style={{ width: 26, height: 26, borderRadius: "50%", border: "1.5px solid transparent" }}
              >
                {done ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#e8e4dc" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span className="font-druk-wide" style={{ fontSize: "0.58rem", color: active ? TEXT : MUTED }}>{i + 1}</span>
                )}
              </motion.div>
              <span className="font-ekstra hidden sm:inline-block" style={{ fontSize: "0.78rem", color: active ? TEXT : MUTED, whiteSpace: "nowrap" }}>
                {s.title}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <motion.div
                animate={{ background: done ? TEXT : "rgba(53,56,63,0.12)" }}
                transition={{ duration: 0.3 }}
                style={{ flex: 1, height: 1.5, borderRadius: 2 }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

const FADE_IN = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -6 },
  transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const },
}
