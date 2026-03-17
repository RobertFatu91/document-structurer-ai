import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { content } = body;

    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing database ID" }),
        { status: 500 }
      );
    }

    const response = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: "AI Generated Output",
              },
            },
          ],
        },
      },
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: content || "No content",
                },
              },
            ],
          },
        },
      ],
    });

    return new Response(
      JSON.stringify({ success: true, data: response }),
      { status: 200 }
    );
  } catch (error) {
    console.error("NOTION ERROR:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Something went wrong",
      }),
      { status: 500 }
    );
  }
}