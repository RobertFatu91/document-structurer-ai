import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("WEBHOOK SIGNATURE ERROR:", error.message);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log("CHECKOUT COMPLETED:", {
          customer: session.customer,
          customer_email: session.customer_details?.email,
          subscription: session.subscription,
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        console.log("SUBSCRIPTION UPDATED:", {
          id: subscription.id,
          status: subscription.status,
          customer: subscription.customer,
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        console.log("SUBSCRIPTION DELETED:", {
          id: subscription.id,
          customer: subscription.customer,
        });
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("WEBHOOK HANDLER ERROR:", error);
    return Response.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

