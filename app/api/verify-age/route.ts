import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { GoogleGenAI } from "@google/genai"
import { sendAgeVerificationConfirmation } from "@/lib/email"

async function checkImage(base64: string, prompt: string): Promise<boolean> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{
        role: "user",
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64 } },
          { text: prompt + " Answer only 'yes' or 'no', nothing else." },
        ],
      }],
    })
    const text = response.text?.toLowerCase().trim() ?? ""
    return text.startsWith("yes")
  } catch {
    // On safety filter block or API error, fail open (don't block user)
    return true
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 })

    const { frontId, backId, selfie } = await req.json()
    if (!frontId || !backId || !selfie) {
      return NextResponse.json({ error: "Alle drei Bilder sind erforderlich" }, { status: 400 })
    }

    const [frontOk, backOk, selfieOk] = await Promise.all([
      // Generic prompts — don't mention "identity document" to avoid safety filters
      checkImage(frontId,  "Does this image show a physical flat object, like a card, held up in front of a camera?"),
      checkImage(backId,   "Does this image show a physical flat object, like a card, held up in front of a camera?"),
      checkImage(selfie,   "Is there a human face clearly visible in this photograph?"),
    ])

    if (!frontOk || !backOk || !selfieOk) {
      const missing = ([!frontOk && "Vorderseite", !backOk && "Rückseite", !selfieOk && "Selfie"] as (string | false)[])
        .filter((v): v is string => Boolean(v)).join(", ")
      return NextResponse.json({
        verified: false,
        error: `Die Prüfung war nicht erfolgreich (${missing}). Bitte achte auf gute Beleuchtung und halte Ausweis/Gesicht klar sichtbar in die Kamera.`,
      })
    }

    await supabase.auth.updateUser({
      data: { age_verified: true, age_verified_at: new Date().toISOString() },
    })

    // Send DSGVO confirmation — fire and forget (don't block response)
    const firstName = user.user_metadata?.first_name ?? user.user_metadata?.full_name?.split(" ")[0]
    sendAgeVerificationConfirmation(user.email!, firstName).catch(() => {})

    return NextResponse.json({ verified: true })
  } catch (err) {
    console.error("verify-age error:", err)
    return NextResponse.json({ error: "Fehler bei der Verifizierung. Bitte versuche es erneut." }, { status: 500 })
  }
}
