import { getUserPlanFromDb } from "@/lib/billing";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json({ plan: "free" });
    }

    const plan = await getUserPlanFromDb(email);

    return Response.json({ plan });
  } catch (error) {
    console.error("PLAN CHECK ERROR:", error);
    return Response.json({ error: "Failed to check plan" }, { status: 500 });
  }
}