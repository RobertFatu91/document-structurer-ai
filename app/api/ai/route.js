import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
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
You are a professional assistant.

Write a clean, short and professional email reply.

Keep it human, not robotic.
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
You are a professional assistant.
Summarize clearly and structure the response well.
`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content },
      ],
    });

    return Response.json({
      result: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("AI ERROR:", error);
    return Response.json(
      { error: error.message || "AI failed" },
      { status: 500 }
    );
  }
}