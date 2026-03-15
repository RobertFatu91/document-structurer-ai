import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const { sessionId } = await req.json()

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    const paid =
      session.payment_status === "paid" ||
      session.status === "complete"

    return Response.json({ valid: paid })
  } catch (err) {
    console.error(err)
    return Response.json({ valid: false })
  }
}