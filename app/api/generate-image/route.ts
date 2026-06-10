import { GoogleGenAI } from "@google/genai"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt erforderlich" }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "API Key nicht konfiguriert" },
        { status: 500 }
      )
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: prompt,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    })

    const parts = response.candidates?.[0]?.content?.parts ?? []
    const imagePart = parts.find(
      (p: any) => p.inlineData?.mimeType?.startsWith("image/")
    )

    if (!imagePart?.inlineData) {
      return NextResponse.json({ error: "Kein Bild generiert" }, { status: 500 })
    }

    return NextResponse.json({
      imageData: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Interner Fehler" },
      { status: 500 }
    )
  }
}
