import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { phrases } from "../src/phrases";

// Manual generation only. No CI, deploy, or browser code invokes this script.
const plan = {
  model: "gpt-4o-mini-tts",
  voice: "coral",
  phrases: phrases.map((p) => ({ id: p.id, text: p.french })),
};
if (!process.argv.includes("--generate")) {
  console.log(JSON.stringify(plan, null, 2));
  console.log(
    "Dry run only. Paid generation requires explicit budget approval and an authorized API key.",
  );
  process.exit(0);
}
if (
  process.env.OPENAI_TTS_SPEND_APPROVED !== "yes" ||
  !(Number(process.env.OPENAI_TTS_APPROVED_BUDGET_USD) > 0)
) {
  throw new Error(
    "Obtain explicit paid-generation approval and a dollar cap before setting OPENAI_TTS_SPEND_APPROVED=yes and OPENAI_TTS_APPROVED_BUDGET_USD.",
  );
}
if (!process.env.OPENAI_API_KEY)
  throw new Error("No authorized OPENAI_API_KEY. No request sent.");
if (process.env.OPENAI_TTS_PRICE_REVIEWED !== "yes") {
  throw new Error(
    "Review current OpenAI pricing against the approved cap first. This endpoint has no per-request dollar ceiling. Then set OPENAI_TTS_PRICE_REVIEWED=yes.",
  );
}
await mkdir("public/audio", { recursive: true });
const samples = [];
for (const phrase of plan.phrases) {
  const path = `public/audio/${phrase.id}.mp3`;
  let bytes = await readFile(path).catch(() => null);
  if (!bytes) {
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: plan.model,
        voice: plan.voice,
        input: phrase.text,
        response_format: "mp3",
        instructions:
          "Speak only these words in clear, natural metropolitan French at a measured pace. Do not imitate an actor.",
      }),
    });
    if (!response.ok)
      throw new Error(
        `OpenAI returned HTTP ${response.status}. No automatic retry. Review the account before retrying.`,
      );
    bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length < 1000)
      throw new Error(
        "Unexpected audio response size. Stop and inspect before retrying.",
      );
    await writeFile(path, bytes, { flag: "wx" });
  }
  samples.push({
    ...phrase,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  });
}
await writeFile(
  "public/audio/manifest.json",
  `${JSON.stringify(
    {
      complete: true,
      provider: "OpenAI",
      model: plan.model,
      voice: plan.voice,
      generated_at: new Date().toISOString(),
      cost_usd: null,
      cost_note: "Verify actual charges in the authorized OpenAI account.",
      samples,
    },
    null,
    2,
  )}\n`,
);
console.log(
  "Four static MP3s saved. Review pronunciation and actual account charges before publishing.",
);
