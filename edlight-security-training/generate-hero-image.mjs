/**
 * Run once to generate the hero image for the landing page.
 * Usage: node generate-hero-image.mjs
 * Requires GEMINI_API_KEY in .env.local
 */
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

// Load .env.local manually (no dotenv dependency needed in Node 20+)
const envPath = new URL(".env.local", import.meta.url).pathname;
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
  }
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Missing GEMINI_API_KEY in .env.local");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const prompt = `
Ultra-realistic cinematic 3D render, wide 16:9 format, designed as a full-bleed hero background for a dark enterprise cybersecurity SaaS platform.

Composition: The LEFT third of the image must be pure deep black — completely dark with no objects, no light, no glow — reserved for white text overlay. LEFT SIDE IS EMPTY AND VERY DARK.

The CENTER and RIGHT portion: an ultra-realistic visualization of a vast digital network — hundreds of interconnected nodes and glowing data pathways forming a complex 3D mesh infrastructure. The network extends deep into the background with strong cinematic depth of field. Some nodes pulse with soft electric blue and ice white light. Thin, precise connection lines glow between nodes. In the far background, barely visible server rack silhouettes and data center geometry.

Color palette: Deep electric blue (#0ea5e9), ice blue (#bae6fd), cold white, and deep indigo. No green. No warm colors. Very cool, cold, technological tone.

Lighting: Dramatic directional volumetric blue light from the right side, casting long blue highlights across the network. Deep black shadows. Photorealistic materials — glowing fiber optics, metallic node spheres, glass panels. Extreme depth of field with distant nodes softly blurred.

Style: Ultra photorealistic, no illustration, no cartoon, no text, no watermarks, cinematic 4K. The mood is serious, controlled, high-security enterprise technology. Think the visual language of elite cybersecurity firms like CrowdStrike or Palo Alto Networks.
`.trim();

console.log("Generating image...");

const response = await ai.models.generateImages({
  model: "imagen-4.0-ultra-generate-001",
  prompt,
  config: {
    numberOfImages: 1,
    outputMimeType: "image/png",
    aspectRatio: "16:9",
  },
});

const image = response.generatedImages?.[0]?.image;
if (!image?.imageBytes) {
  console.error("No image returned. Full response:", JSON.stringify(response, null, 2));
  process.exit(1);
}

const outPath = path.resolve("public/hero-image.png");
fs.writeFileSync(outPath, Buffer.from(image.imageBytes, "base64"));
console.log("Saved to", outPath);
