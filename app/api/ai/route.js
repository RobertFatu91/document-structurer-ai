import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { aiRateLimit } from "@/lib/rate-limit";

import {
  canUseAi,
  consumeAiUsageIfNeeded
} from "@/lib/billing";


import OpenAI from "openai";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
const email = session?.user?.email;

if (!email) {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
  status: 401,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  },
});
}
const { success } = await aiRateLimit.limit(email);

if (!success) {
  return new Response(JSON.stringify({
  error: "Too many requests. Please try again in a minute."
}), {
  status: 429,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  },
});
}

console.log("EMAIL:", email);
  try {
    const { type, content } = await req.json();
    



    let systemPrompt = "";

    if (type === "email-summary") {
      systemPrompt = `
You are a professional assistant.
Summarize emails clearly.

Return format:

SUMMARY
...

KEY POINTS
- ...
- ...

ACTION ITEMS
- ...
`;
    } else if (type === "email-reply") {
      systemPrompt = `
You rewrite messy draft emails into final client-ready emails.

Rules:
- Output ONLY the final email
- Do NOT say things like Certainly, Here is a response, Here is a clear reply, or similar
- Do NOT add explanations before or after
- Do NOT add placeholder text like [Your Name] or [Name]
- Do NOT add commentary
- Keep it natural, professional, and concise

Formatting:
- Start directly with the email greeting
- Use short paragraphs
- End naturally
- If the original text does not include a sign-off request, do not invent extra filler

Your job is to return only the cleaned final email message.
`;
    } else if (type === "notes") {
      systemPrompt = `
Turn messy notes into structured output.

Format:

SUMMARY
...

KEY POINTS
...

ACTION ITEMS
...
`;
    } else if (type === "meeting") {
      systemPrompt = `
You are a professional meeting assistant.

Summarize the meeting clearly.

Return format:

SUMMARY
...

KEY DECISIONS
- ...
- ...

ACTION ITEMS
- ...
- ...
`;
    } else {
      systemPrompt = `
You are an expert assistant that rewrites messy text into clean, professional, client-ready communication.

Rules:
- DO NOT include explanations
- DO NOT say "Here is a response you can use"
- DO NOT add introductions
- DO NOT add notes before or after the message
- Output ONLY the final message

Style:
- Clear
- Professional
- Concise
- Human, not robotic

For emails:
- Add a proper greeting if needed
- Structure into short paragraphs
- Improve clarity and grammar
- Keep the tone natural and polite

Return ONLY the final improved message.
`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content },
      ],
    });
    await consumeAiUsageIfNeeded(email);

    return new Response(
  JSON.stringify({
    result: completion.choices[0].message.content,
  }),
  {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  }
);
  } catch (error) {
    console.error("AI ERROR:", error);
    return new Response(
  JSON.stringify({
    error: error.message || "AI failed",
  }),
  {
    status: 500,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  }
);
  }
}