import Subscription from "../models/Subscription.js";

/**
 * Middleware to check if a user (Provider or Customer) has an active subscription
 * or is within their 1-month free trial period.
 */
export const checkSubscriptionOrTrial = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    // Admins bypass all subscription checks
    if (user.role === "admin") {
      return next();
    }

    // 1. Check for Free Trial (First 30 days)
    // We need the full user object from the DB to check createdAt
    const UserModel = (await import(`../models/${user.role.charAt(0).toUpperCase() + user.role.slice(1)}.js`)).default;
    const dbUser = await UserModel.findById(user.id);

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const trialPeriodDays = 30;
    const trialExpirationDate = new Date(dbUser.createdAt);
    trialExpirationDate.setDate(trialExpirationDate.getDate() + trialPeriodDays);

    const isWithinTrial = new Date() < trialExpirationDate;

    if (isWithinTrial) {
      return next();
    }

    // 2. Check for Active Paid Subscription
    const activeSubscription = await Subscription.findOne({
      userId: user.id,
      status: "Active",
      paymentStatus: "paid",
      end_date: { $gt: new Date() },
    });

    if (activeSubscription) {
      return next();
    }

    // If neither trial nor active subscription
    return res.status(403).json({
      success: false,
      statusCode: 403,
      message: "Access denied. An active subscription is required after the 1-month free trial.",
      requiresSubscription: true,
      trialExpired: true,
    });
  } catch (error) {
    console.error("Subscription Check Error:", error);
    next(error);
  }
};
