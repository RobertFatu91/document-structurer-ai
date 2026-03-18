import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { plan, email } = await req.json();

    let priceId = "";

    if (plan === "pro") {
      priceId = process.env.STRIPE_PRICE_ID_PRO;
    } else if (plan === "ultra") {
      priceId = process.env.STRIPE_PRICE_ID_ULTRA;
    } else {
      return Response.json({ error: "Invalid plan" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email || undefined,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("STRIPE CHECKOUT ERROR:", error);
    return Response.json(
      { error: error.message || "Stripe checkout failed" },
      { status: 500 }
    );
  }
}

