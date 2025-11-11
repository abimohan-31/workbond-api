import Subscription from "../models/Subscription.js";

// Subscription middleware - Checks if provider has active subscription
export const checkSubscription = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "provider") {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "This route is only accessible to providers.",
      });
    }

    // Check for active subscription
    const subscription = await Subscription.findOne({
      provider_id: req.user.id,
      status: "Active",
      end_date: { $gte: new Date() },
    });

    if (!subscription) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Access denied. Active subscription required.",
      });
    }

    // Attach subscription info to request
    req.subscription = subscription;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error checking subscription.",
    });
  }
};
