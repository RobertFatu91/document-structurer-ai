import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { aiRateLimit } from "@/lib/rate-limit";

import {
  canUseAi,
  consumeAiUsageIfNeeded
} from "@/lib/billing";


import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
  try {
    const { type, content, email, tone } = await req.json();

    if (!email) {
  return Response.json(
    { error: "Email is required" },
    { status: 400 }
  );
}

const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .select("plan, extension_plan, smart_reply_free_used")
  .eq("email", email)
  .single();

if (profileError && profileError.code !== "PGRST116") {
  console.error("PROFILE FETCH ERROR:", profileError);
  return Response.json(
    { error: "Could not verify user plan" },
    { status: 500 }
  );
}

const userPlan = profile?.plan || "free";
const extensionPlan = profile?.extension_plan || "free";
const freeUsed = profile?.smart_reply_free_used || 0;

const hasPaidAccess =
  extensionPlan === "smart_reply_pro" ||
  extensionPlan === "smart_reply_ultra";

if (!hasPaidAccess && freeUsed >= 3) {
  return Response.json(
    { error: "Free limit reached. Upgrade to continue." },
    { status: 403 }
  );
}

    if (!email) {
      return new Response(
        JSON.stringify({ error: "No email address detected." }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
    }

    console.log("EMAIL:", email);

    const success = false;

    if (!success) {
      return new Response(
        JSON.stringify({
          error: "Free limit reached. Upgrade to continue.",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
    }

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
You write ready-to-send email replies.

Tone: ${tone || "professional"}

Rules:
- Output ONLY the final email reply
- Do NOT say things like "Certainly", "Here is your reply", or "Here is a professional response"
- Do NOT add explanations before or after the email
- Do NOT add placeholder text like [Your Name] or [Name]
- Do NOT add commentary
- Keep it natural, human, and ready to send

Tone guidance:
- professional: polished, confident, businesslike
- polite: respectful, warm, considerate
- friendly: approachable, relaxed, still professional
- concise: short, direct, efficient

Formatting:
- Start directly with the email greeting
- Use short paragraphs
- End naturally
- Do not invent unnecessary details

Return only the final email reply.
    
`;
    
    } else if (type === "notes") {
  systemPrompt = `
Turn messy notes into structured output.

Return format:

SUMMARY
- brief summary

KEY POINTS
- important point
- important point

ACTION ITEMS
- action item
- action item

STRUCTURED SECTIONS
- organize the information clearly into useful sections
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