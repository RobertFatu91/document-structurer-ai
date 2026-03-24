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
    console.error("WEBHOOK SIGNATURE ERROR:", error);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    console.log("WEBHOOK EVENT TYPE:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("CHECKOUT SESSION:", session);

      const customerEmail =
        session.customer_details?.email || session.customer_email || null;

      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id || null;

      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id || null;

      let stripePriceId = null;
      let subscriptionStatus = null;

      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        console.log("SUBSCRIPTION FROM CHECKOUT:", subscription);

        stripePriceId = subscription.items?.data?.[0]?.price?.id || null;
        subscriptionStatus = subscription.status || null;
      }

      console.log("customerEmail:", customerEmail);
      console.log("customerId:", customerId);
      console.log("subscriptionId:", subscriptionId);
      console.log("stripePriceId:", stripePriceId);
      console.log("subscriptionStatus:", subscriptionStatus);

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
  console.log("PLAN UPDATED TO PRO FOR:", customerEmail);
} else if (stripePriceId === process.env.STRIPE_PRICE_ID_ULTRA) {
  await setUserPlan(customerEmail, "ultra");
  await resetFreeUsage(customerEmail);
  console.log("PLAN UPDATED TO ULTRA FOR:", customerEmail);
} else if (stripePriceId === process.env.STRIPE_EXTENSION_PRICE_ID_PRO) {
  await setUserPlan(customerEmail, "smart_reply_pro");
  await resetFreeUsage(customerEmail);
  console.log("PLAN UPDATED TO SMART_REPLY_PRO FOR:", customerEmail);
} else if (stripePriceId === process.env.STRIPE_EXTENSION_PRICE_ID_ULTRA) {
  await setUserPlan(customerEmail, "smart_reply_ultra");
  await resetFreeUsage(customerEmail);
  console.log("PLAN UPDATED TO SMART_REPLY_ULTRA FOR:", customerEmail);
}
      }
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;
      console.log("SUBSCRIPTION UPDATED EVENT:", subscription);

      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer?.id || null;

      const subscriptionId = subscription.id || null;
      const stripePriceId = subscription.items?.data?.[0]?.price?.id || null;
      const subscriptionStatus = subscription.status || null;

      if (customerId) {
        const customer = await stripe.customers.retrieve(customerId);
        console.log("CUSTOMER FROM SUB UPDATED:", customer);

        if (!customer.deleted && customer.email) {
          await saveStripeCustomerData({
            email: customer.email,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripePriceId,
            subscriptionStatus,
          });

          if (stripePriceId === process.env.STRIPE_PRICE_ID_PRO) {
  await setUserPlan(customer.email, "pro");
  await resetFreeUsage(customer.email);
  console.log("PLAN UPDATED TO PRO FROM SUB UPDATE:", customer.email);
} else if (stripePriceId === process.env.STRIPE_PRICE_ID_ULTRA) {
  await setUserPlan(customer.email, "ultra");
  await resetFreeUsage(customer.email);
  console.log("PLAN UPDATED TO ULTRA FROM SUB UPDATE:", customer.email);
} else if (stripePriceId === process.env.STRIPE_EXTENSION_PRICE_ID_PRO) {
  await setUserPlan(customer.email, "smart_reply_pro");
  await resetFreeUsage(customer.email);
  console.log("PLAN UPDATED TO SMART_REPLY_PRO FROM SUB UPDATE:", customer.email);
} else if (stripePriceId === process.env.STRIPE_EXTENSION_PRICE_ID_ULTRA) {
  await setUserPlan(customer.email, "smart_reply_ultra");
  await resetFreeUsage(customer.email);
  console.log("PLAN UPDATED TO SMART_REPLY_ULTRA FROM SUB UPDATE:", customer.email);
}
          
        }
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      console.log("SUBSCRIPTION DELETED EVENT:", subscription);

      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer?.id || null;

      if (customerId) {
        const customer = await stripe.customers.retrieve(customerId);
        console.log("CUSTOMER FROM SUB DELETED:", customer);

        if (!customer.deleted && customer.email) {
          await saveStripeCustomerData({
            email: customer.email,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscription.id || null,
            stripePriceId: null,
            subscriptionStatus: "canceled",
          });

          await setUserPlan(customer.email, "free");
          console.log("PLAN UPDATED TO FREE FOR:", customer.email);
        }
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("WEBHOOK HANDLER ERROR FULL:", error);
    return Response.json(
      {
        error: "Webhook handler failed",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}