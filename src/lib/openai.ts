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
- cover_prompt: string, describes a clean minimal pinterest-style cover image with the title text, soft colors, lots of whitespace
- pages: array of 4-8 objects each with { heading, body }. These are the actual printable pages. Body can be short list items separated by newlines, a prompt, a prayer, a checklist, etc. Make the content USEFUL and specific to the idea.
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
      prompt: `Clean minimal Pinterest-style cover image, soft paper background, elegant serif-sans mix, lots of whitespace, no photographs of people. ${prompt}`,
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
