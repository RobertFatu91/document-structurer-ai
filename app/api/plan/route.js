import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json({ plan: "free" });
    }

    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (!customers.data.length) {
      return Response.json({ plan: "free" });
    }

    const customer = customers.data[0];

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "all",
      limit: 10,
    });

    const activeSubscription = subscriptions.data.find((sub) =>
      ["active", "trialing", "past_due"].includes(sub.status)
    );

    if (!activeSubscription) {
      return Response.json({ plan: "free" });
    }

    const priceId = activeSubscription.items.data[0]?.price?.id;

    if (priceId === process.env.STRIPE_PRICE_ID_ULTRA) {
      return Response.json({ plan: "ultra" });
    }

    if (priceId === process.env.STRIPE_PRICE_ID_PRO) {
      return Response.json({ plan: "pro" });
    }

    return Response.json({ plan: "free" });
  } catch (error) {
    console.error("PLAN CHECK ERROR:", error);
    return Response.json({ error: "Failed to check plan" }, { status: 500 });
  }
}

