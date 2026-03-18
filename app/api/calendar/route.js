import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canUseUltraFeatures } from "@/lib/billing";


export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }
const email = session?.user?.email;

if (!email) {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

const isUltra = await canUseUltraFeatures(email);

if (!isUltra) {
  return Response.json({ error: "Ultra plan required" }, { status: 403 });
}

  const accessToken = session.accessToken;

  if (!accessToken) {
    return Response.json({ error: "No access token" }, { status: 401 });
  }

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: "v3", auth });

    const now = new Date();
    const in30Days = new Date();
    in30Days.setDate(now.getDate() + 30);

    const res = await calendar.events.list({
      calendarId: "primary",
      timeMin: now.toISOString(),
      timeMax: in30Days.toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = (res.data.items || []).map((event) => ({
      id: event.id,
      summary: event.summary || "Untitled event",
      description: event.description || "",
      location: event.location || "",
      start:
        event.start?.dateTime ||
        event.start?.date ||
        "",
      end:
        event.end?.dateTime ||
        event.end?.date ||
        "",
      htmlLink: event.htmlLink || "",
    }));

    return Response.json({ events });
  } catch (error) {
    console.error("CALENDAR FETCH ERROR:", error);
    return Response.json(
      { error: error.message || "Failed to fetch calendar events" },
      { status: 500 }
    );
  }
}