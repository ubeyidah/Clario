import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export const POST = async (req: Request) => {
  const body = await req.text();
  const headersList = await headers();

  const signiture = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signiture,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    return new Response("Webhook error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const courseId = session.metadata?.courseId;
    const customerId = session.customer as string;
    const enrollmentId = session.metadata?.enrollmentId as string;

    if (!courseId) throw new Error("Course not found.");

    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    });

    if (!user) throw new Error("Customer not found.");

    await prisma.enrollment.update({
      where: {
        id: enrollmentId,
      },
      data: {
        status: "ACTIVE",
      },
    });
  }

  return new Response(null, { status: 200 });
};
