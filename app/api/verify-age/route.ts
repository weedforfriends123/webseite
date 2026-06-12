import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

async function checkImage(base64: string, prompt: string): Promise<boolean> {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{
      role: "user",
      parts: [
        { inlineData: { mimeType: "image/jpeg", data: base64 } },
        { text: prompt + " Answer only 'yes' or 'no'." },
      ],
    }],
  })
  const text = response.text?.toLowerCase().trim() ?? ""
  return text.startsWith("yes")
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
      checkImage(frontId,  "Is this the front side of a valid identity document (ID card or passport)?"),
      checkImage(backId,   "Is this the back side of a valid identity document (ID card or passport), or the back page of a passport showing personal data?"),
      checkImage(selfie,   "Is this a clear selfie or portrait photo showing a human face?"),
    ])

    if (!frontOk || !backOk || !selfieOk) {
      const missing = [!frontOk && "Vorderseite", !backOk && "Rückseite", !selfieOk && "Selfie"]
        .filter(Boolean).join(", ")
      return NextResponse.json({ verified: false, error: `Bitte prüfe: ${missing}` })
    }

    await supabase.auth.updateUser({ data: { age_verified: true, age_verified_at: new Date().toISOString() } })
    return NextResponse.json({ verified: true })
  } catch (err) {
    console.error("verify-age error:", err)
    return NextResponse.json({ error: "Fehler bei der Verifizierung. Bitte versuche es erneut." }, { status: 500 })
  }
}
