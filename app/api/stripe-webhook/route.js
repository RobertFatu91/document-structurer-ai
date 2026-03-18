import Stripe from "stripe";
import { setUserPlan, resetFreeUsage, saveStripeCustomerData } from "@/lib/billing";

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
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const customerEmail =
        session.customer_details?.email || session.customer_email || null;

      const subscriptionId = session.subscription || null;
      const customerId = session.customer || null;

      let stripePriceId = null;
      let subscriptionStatus = null;

      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        stripePriceId = subscription.items.data[0]?.price?.id || null;
        subscriptionStatus = subscription.status || null;
      }

      if (customerEmail) {
        await saveStripeCustomerData({
          email: customerEmail,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          stripePriceId,
          subscriptionStatus,
        });

        if (stripePriceId === process.env.STRIPE_PRICE_ID_PRO) {
          await setUserPlan(customerEmail, "pro");
          await resetFreeUsage(customerEmail);
        }

        if (stripePriceId === process.env.STRIPE_PRICE_ID_ULTRA) {
          await setUserPlan(customerEmail, "ultra");
          await resetFreeUsage(customerEmail);
        }
      }
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;

      const customerId = subscription.customer || null;
      const subscriptionId = subscription.id || null;
      const stripePriceId = subscription.items.data[0]?.price?.id || null;
      const subscriptionStatus = subscription.status || null;

      if (customerId) {
        const customer = await stripe.customers.retrieve(customerId);

        if (!customer.deleted && customer.email) {
          await saveStripeCustomerData({
            email: customer.email,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripePriceId,
            subscriptionStatus,
          });

          if (subscriptionStatus === "active") {
            if (stripePriceId === process.env.STRIPE_PRICE_ID_PRO) {
              await setUserPlan(customer.email, "pro");
              await resetFreeUsage(customer.email);
            }

            if (stripePriceId === process.env.STRIPE_PRICE_ID_ULTRA) {
              await setUserPlan(customer.email, "ultra");
              await resetFreeUsage(customer.email);
            }
          }
        }
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const customerId = subscription.customer || null;

      if (customerId) {
        const customer = await stripe.customers.retrieve(customerId);

        if (!customer.deleted && customer.email) {
          await saveStripeCustomerData({
            email: customer.email,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscription.id || null,
            stripePriceId: null,
            subscriptionStatus: "canceled",
          });

          await setUserPlan(customer.email, "free");
        }
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("WEBHOOK HANDLER ERROR:", error);
    return Response.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}