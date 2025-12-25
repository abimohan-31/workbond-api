import Stripe from "stripe";
import Provider from "../models/Provider.js";
import Customer from "../models/Customer.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      
      if (session.metadata.type === "subscription_payment") {
        const subscriptionId = session.metadata.subscriptionId;
        const userId = session.metadata.userId;
        const userType = session.metadata.userType;

        const Subscription = (await import("../models/Subscription.js")).default;
        const subscription = await Subscription.findById(subscriptionId);

        if (subscription) {
          subscription.paymentStatus = "paid";
          subscription.paidAt = new Date();
          subscription.status = "Active";
          await subscription.save();

          const Model = userType === "Provider" ? Provider : Customer;
          await Model.findByIdAndUpdate(userId, {
            currentSubscriptionId: subscriptionId,
          });

          console.log(`${userType} subscription payment completed:`, subscriptionId);
        }
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

export const createSubscriptionPayment = async (req, res, next) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Subscription ID is required",
      });
    }

    const Subscription = (await import("../models/Subscription.js")).default;
    const subscription = await Subscription.findById(subscriptionId).populate(
      "userId",
      "name email stripeCustomerId role"
    );

    if (!subscription) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Subscription not found",
      });
    }

    if (subscription.userId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "You can only pay for your own subscriptions",
      });
    }

    if (subscription.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "This subscription has already been paid",
      });
    }

    const user = subscription.userId;
    const userType = subscription.userType;
    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: req.user.id,
          role: user.role,
        },
      });
      stripeCustomerId = stripeCustomer.id;

      const Model = userType === "Provider" ? Provider : Customer;
      await Model.findByIdAndUpdate(req.user.id, {
        stripeCustomerId: stripeCustomerId,
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${subscription.plan_name} Subscription Plan`,
              description: `Subscription from ${new Date(
                subscription.start_date
              ).toLocaleDateString()} to ${new Date(
                subscription.end_date
              ).toLocaleDateString()}`,
            },
            unit_amount: Math.round(subscription.amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/${user.role}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/${user.role}/subscription/cancel`,
      metadata: {
        subscriptionId: subscriptionId,
        userId: req.user.id,
        userType: userType,
        type: "subscription_payment",
      },
    });

    subscription.stripeCheckoutSessionId = session.id;
    await subscription.save();

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSubscriptionStatus = async (req, res, next) => {
  try {
    const Subscription = (await import("../models/Subscription.js")).default;
    const userType = req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1);
    const Model = userType === "Provider" ? Provider : Customer;

    const dbUser = await Model.findById(req.user.id).populate(
      "currentSubscriptionId"
    );

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "User not found",
      });
    }

    const subscriptions = await Subscription.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    const activeSubscription = subscriptions.find(
      (sub) => sub.status === "Active" && sub.paymentStatus === "paid"
    );

    const pendingSubscription = subscriptions.find(
      (sub) => sub.paymentStatus === "pending"
    );

    const trialPeriodDays = 30;
    const trialExpiresAt = new Date(dbUser.createdAt);
    trialExpiresAt.setDate(trialExpiresAt.getDate() + trialPeriodDays);
    const isTrialActive = new Date() < trialExpiresAt;

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        activeSubscription: activeSubscription || null,
        pendingSubscription: pendingSubscription || null,
        allSubscriptions: subscriptions,
        isTrialActive,
        trialExpiresAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
