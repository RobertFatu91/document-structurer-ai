import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserPlanFromDb } from "@/lib/billing";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plan = await getUserPlanFromDb(email);

    return Response.json({ plan });
  } catch (error) {
    console.error("PLAN CHECK ERROR:", error);
    return Response.json({ error: "Failed to check plan" }, { status: 500 });
  }
}