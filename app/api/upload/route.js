import OpenAI from "openai"
import mammoth from "mammoth"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

function getSystemPrompt(mode) {
  if (mode === "tasks") {
    return `
You are a task organization assistant.

Turn the document into a clean task list.

Rules:
- Use bullet points
- Improve grammar
- Keep tasks short and clear
`
  }

  if (mode === "email") {
    return `
You are a professional email assistant.

Turn the document into a polished professional email.

Rules:
- Add a clear subject line
- Use professional tone
- Keep the meaning the same
`
  }

  if (mode === "summary") {
    return `
You are a summarization assistant.

Turn the document into a structured summary.

Use these sections:
Summary
Key Points
Next Steps

Rules:
- Be concise
- Use bullet points where useful
`
  }

  return `
You are a professional meeting notes assistant.

Convert the document into a structured meeting report using the following sections:

Summary
Key Points
Action Items
Deadlines
Decisions

Rules:
- Keep everything clear and concise
- Use bullet points
- If a section has no information write "None"
`
}

export async function POST(req) {
  try {
    const formData = await req.formData()
    const file = formData.get("file")
    const mode = formData.get("mode") || "meeting"

    if (!file) {
      return Response.json({
        error: "No file uploaded"
      })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    let extractedText = ""

    if (file.name.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer })
      extractedText = result.value
    } else {
      return Response.json({
        error: "For now, only .docx files are supported"
      })
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: getSystemPrompt(mode)
        },
        {
          role: "user",
          content: extractedText
        }
      ]
    })

    return Response.json({
      result: completion.choices[0].message.content
    })
  } catch (error) {
    console.error(error)

    return Response.json({
      error: "File processing error"
    })
  }
}