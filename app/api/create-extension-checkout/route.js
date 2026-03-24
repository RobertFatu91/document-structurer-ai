import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { plan, userId, email } = body;

    let priceId = null;

    if (plan === "pro") {
      priceId = process.env.STRIPE_EXTENSION_PRICE_ID_PRO;
    } else if (plan === "ultra") {
      priceId = process.env.STRIPE_EXTENSION_PRICE_ID_ULTRA;
    } else {
      return Response.json({ error: "Invalid plan" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: "https://document-structurer-ai.vercel.app/success",
      cancel_url: "https://document-structurer-ai.vercel.app/cancel",
      customer_email: email || undefined,
      metadata: {
        userId: userId || "",
        source: "extension",
        extension_plan: plan,
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("EXTENSION CHECKOUT ERROR:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}