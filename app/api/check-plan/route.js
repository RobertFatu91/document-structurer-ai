import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ plan: "free" });
    }

    // caută customer
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({ plan: "free" });
    }

    const customer = customers.data[0];

    // ia subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ plan: "free" });
    }

    const subscription = subscriptions.data[0];
    const priceId = subscription.items.data[0].price.id;

    // ⚠️ AICI pui ID-urile tale reale
    if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
      return NextResponse.json({ plan: "pro" });
    }

    if (priceId === process.env.STRIPE_ULTRA_PRICE_ID) {
      return NextResponse.json({ plan: "ultra" });
    }

    return NextResponse.json({ plan: "free" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ plan: "free" });
  }
}