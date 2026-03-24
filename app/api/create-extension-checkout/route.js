import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.json();
  const { priceId, userId } = body;

  try {
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
      metadata: {
        userId,
        source: "extension"
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}