import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type Listing = {
  title: string;
  description: string;
  tags: string[];
  price: number;
  cover_prompt: string;
  pages: Array<{ heading: string; body: string }>;
  pins: Array<{ pin_title: string; pin_description: string }>;
  day_one_plan: string[];
};

const SYSTEM = `You are an Etsy printables expert. You write natural, buyer-friendly Etsy listings — no keyword stuffing.
You return STRICT JSON only. No markdown. No commentary.
The buyer is a real human. Titles should read naturally. Tags should be specific phrases.
Keep language warm and simple.`;

export async function generateListing(idea: string, template: string): Promise<Listing> {
  const user = `IDEA: "${idea}"
TEMPLATE: "${template}"

Return JSON with these exact keys:
- title: string, 70-140 chars, natural, no keyword stuffing, front-loaded with the main benefit
- description: string, 500-900 chars, friendly, includes what's inside, how to use, file format (PDF)
- tags: array of 13 strings, 2-4 words each, long-tail keywords a real buyer would type
- price: number, between 3 and 9 (USD)
- cover_prompt: string. Describe a PURELY DECORATIVE background illustration — soft paper texture, subtle botanical or geometric motifs, soft muted colors (cream, blush, sage, dusty blue). IMPORTANT: "no text, no words, no letters, no typography, no numbers anywhere in the image. Leave the center of the image softer / emptier so overlay text will read well. Pinterest cover aesthetic, flat illustration style, no photographs of people."
- pages: array of 10-12 objects each with { heading, body }. Each page is one full printable page of a journal/planner/workbook. The heading is short (2-4 words). The body contains 4-6 PROMPTS or fill-in lines, each on its own line separated by newlines. Prompts should be short (one short sentence each, usually ending in ? or :) because the PDF renderer will add real writing lines under each one for the buyer to write in. Vary pages so the journal feels rich: gratitude prompts, reflection questions, mood check-in, dreams and goals, affirmations to copy out, letter to self, self-care checklist, habit tracker prompts, before-bed wind-down, morning intentions, etc. Make every page SPECIFIC to the idea — do not repeat generic prompts.
- pins: array of 5 objects each with { pin_title, pin_description }. These are Pinterest pin ideas to drive traffic. pin_title 40-60 chars. pin_description 120-200 chars.
- day_one_plan: array of 5 strings, each a single action step for the seller to launch this listing today (upload to Etsy, post pins, set ads budget $3-5/day, etc.)

STRICT JSON only.`;

  const r = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: user },
    ],
    response_format: { type: "json_object" },
    temperature: 0.8,
  });

  const raw = r.choices[0]?.message?.content || "{}";
  return JSON.parse(raw) as Listing;
}

export async function generateCover(prompt: string): Promise<string> {
  // Returns base64 PNG
  try {
    const r = await openai.images.generate({
      model: "dall-e-3",
      prompt: `A purely decorative background illustration for a printable journal cover. STRICT: no text, no words, no letters, no numbers, no typography of any kind anywhere in the image. Soft paper texture background. Delicate botanical or geometric motifs around the edges. Keep the center of the image softer and less detailed so overlay text can sit cleanly on top. Muted palette (cream, blush, sage, dusty blue). Flat illustration style. No photographs, no people, no faces, no logos. Pinterest-cover aesthetic. ${prompt}`,
      size: "1024x1024",
      quality: "standard",
      n: 1,
      response_format: "b64_json",
    });
    return r.data?.[0]?.b64_json || "";
  } catch (e) {
    console.error("[openai] cover failed, using fallback", e);
    return "";
  }
}
