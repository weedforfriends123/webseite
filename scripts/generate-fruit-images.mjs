import Replicate from "replicate"
import fs from "fs"
import path from "path"
import https from "https"

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

const OUTPUT_DIR = "./public/fruits"

// Flavor → fruit prompt mapping
const FLAVORS = [
  {
    key: "amnesia-haze",
    prompt: "Two fresh lemons and a halved lime with vivid green skin, scattered carelessly on a smooth matte surface the color #bcc0ca (a soft warm grey-blue), studio product photography, dramatic side lighting, deep shadows, cinematic editorial style, photorealistic, 8K, no text, isolated on exact background color #bcc0ca",
  },
  {
    key: "purple-haze",
    prompt: "A cluster of fresh dark purple grapes and ripe blackberries spilling apart, on a smooth matte surface the color #bcc0ca (soft warm grey-blue), studio product photography, dramatic side lighting, deep shadows, cinematic editorial style, photorealistic, 8K, no text",
  },
  {
    key: "northern-lights",
    prompt: "Fresh pine branch with needles and two pine cones fallen casually, on a smooth matte surface the color #bcc0ca (soft warm grey-blue), studio product photography, cool dramatic lighting, deep shadows, cinematic editorial style, photorealistic, 8K, no text",
  },
  {
    key: "ice-cream-cookies",
    prompt: "Two scoops of vanilla ice cream in a wafer cone lying on its side, a broken Oreo cookie beside it, on a smooth matte surface the color #bcc0ca (soft warm grey-blue), studio product photography, soft dramatic lighting, cinematic editorial style, photorealistic, 8K, no text",
  },
  {
    key: "girl-scout-cookies",
    prompt: "Three stacked shortbread cookies with a broken piece next to them revealing a caramel chocolate center, on a smooth matte surface the color #bcc0ca (soft warm grey-blue), studio product photography, warm dramatic side lighting, cinematic editorial style, photorealistic, 8K, no text",
  },
  {
    key: "gelato",
    prompt: "A scoop of pistachio gelato and a scoop of strawberry gelato side by side with a fresh strawberry cut in half next to them, on a smooth matte surface the color #bcc0ca (soft warm grey-blue), studio product photography, soft dramatic lighting, cinematic editorial style, photorealistic, 8K, no text",
  },
]

async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https.get(url, (res) => {
      res.pipe(file)
      file.on("finish", () => { file.close(); resolve() })
    }).on("error", (err) => { fs.unlink(dest, () => {}); reject(err) })
  })
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  for (const flavor of FLAVORS) {
    console.log(`Generating: ${flavor.key}...`)
    try {
      const output = await replicate.run("black-forest-labs/flux-2-pro", {
        input: {
          prompt: flavor.prompt,
          resolution: "1 MP",
          aspect_ratio: "1:1",
          output_format: "webp",
          output_quality: 90,
          safety_tolerance: 2,
        },
      })

      const url = Array.isArray(output) ? output[0] : output
      const dest = path.join(OUTPUT_DIR, `${flavor.key}.webp`)
      await downloadImage(url.toString(), dest)
      console.log(`  ✓ Saved: ${dest}`)
    } catch (err) {
      console.error(`  ✗ Failed ${flavor.key}:`, err.message)
    }
  }

  console.log("\nDone! All fruit images saved to /public/fruits/")
}

main()
