import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

function decodeBase64Url(data) {
  if (!data) return "";
  const base64 = data.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(base64, "base64").toString("utf-8");
}

function extractPlainText(payload) {
  if (!payload) return "";

  if (payload.mimeType === "text/plain" && payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }

  if (payload.parts && Array.isArray(payload.parts)) {
    for (const part of payload.parts) {
      const text = extractPlainText(part);
      if (text) return text;
    }
  }

  if (payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }

  return "";
}

function getHeader(headers, name) {
  return headers?.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value || "";
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const accessToken = session.accessToken;

  if (!accessToken) {
    return Response.json({ error: "No access token" }, { status: 401 });
  }

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: "v1", auth });

    const listRes = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
      labelIds: ["INBOX"],
    });

    const messages = listRes.data.messages || [];
    const emails = [];

    for (const msg of messages) {
      const detailRes = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
        format: "full",
      });

      const data = detailRes.data;
      const headers = data.payload?.headers || [];

      const subject = getHeader(headers, "Subject") || "No subject";
      const from = getHeader(headers, "From") || "Unknown sender";
      const date = getHeader(headers, "Date") || "";
      const snippet = data.snippet || "";
      const body = extractPlainText(data.payload) || snippet || "No content available";

      emails.push({
        id: msg.id,
        threadId: data.threadId || "",
        subject,
        from,
        date,
        snippet,
        body,
      });
    }

    return Response.json({ emails });
  } catch (error) {
    console.error("GMAIL FETCH ERROR:", error);
    return Response.json(
      { error: error.message || "Failed to fetch emails" },
      { status: 500 }
    );
  }
}