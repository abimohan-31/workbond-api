import Subscription from "../models/Subscription.js";
import Provider from "../models/Provider.js";
import Customer from "../models/Customer.js";
import { queryHelper } from "../utils/queryHelper.js";

// GET /api/subscriptions - Get subscriptions
// Admin: See all subscriptions
// Provider: See only their own subscriptions
// Customer/Public: No access (handled by route middleware)
export const getAllSubscriptions = async (req, res, next) => {
  try {
    let defaultFilters = {};

    // Role-based filtering
    if (req.user.role !== "admin") {
      defaultFilters.userId = req.user.id;
    }

    const { data, pagination } = await queryHelper(
      Subscription,
      req.query,
      ["plan_name"], 
      {
        defaultFilters,
        populate: {
          path: "userId",
          select: "name email role",
        },
      }
    );

    return res.status(200).json({
      success: true,
      data,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/subscriptions/:id - Get subscription by ID
// Admin: Can view any subscription
// Provider: Can only view their own subscription
export const getSubscriptionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findById(id).populate(
      "userId",
      "name email role"
    );

    if (!subscription) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Subscription not found",
      });
    }

    // Access control: Users can only view their own subscriptions
    if (req.user.role !== "admin") {
      if (subscription.userId._id.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          statusCode: 403,
          message: "Access denied. You can only view your own subscription.",
        });
      }
    }
    // Admin can view any subscription

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/subscriptions - Create subscription (admin only)
export const createSubscription = async (req, res, next) => {
  try {
    const { userId, userType, plan_name, start_date, end_date, renewal_date, status, amount } = req.body;

    // Validation
    if (!userId || !userType) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "User ID and User Type are required",
      });
    }

    if (!plan_name || !end_date) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Plan name and end date are required",
      });
    }

    if (amount === undefined || amount === null) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Amount is required",
      });
    }

    // Verify user exists
    const Model = userType === "Provider" ? Provider : Customer;
    const user = await Model.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: `${userType} not found`,
      });
    }

    const subscription = new Subscription({
      userId,
      userType,
      plan_name,
      start_date: start_date || new Date(),
      end_date,
      renewal_date,
      status: status || "Active",
      amount,
      paymentStatus: amount > 0 ? "pending" : "paid",
      paidAt: amount === 0 ? new Date() : null,
    });

    await subscription.save();

    if (amount === 0 || subscription.paymentStatus === "paid") {
      await Model.findByIdAndUpdate(userId, {
        currentSubscriptionId: subscription._id,
      });
    }

    const populatedSubscription = await Subscription.findById(
      subscription._id
    ).populate("userId", "name email role");

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: amount > 0 
        ? "Subscription created successfully. User needs to complete payment."
        : "Free subscription created and activated successfully.",
      data: {
        subscription: populatedSubscription,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: `Duplicate key error: ${field} already exists`,
        errors: [{ field, message: "already exists" }],
      });
    }
    next(error);
  }
};

// PUT /api/subscriptions/:id - Update subscription (admin only)
export const updateSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, plan_name, end_date, amount, paymentStatus } = req.body;

    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Subscription not found",
      });
    }

    if (status) {
      const validStatuses = ["Active", "Cancelled", "Expired"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Invalid status. Must be Active, Cancelled, or Expired",
        });
      }
      subscription.status = status;
    }

    if (plan_name) subscription.plan_name = plan_name;
    if (end_date) subscription.end_date = end_date;
    if (amount !== undefined) subscription.amount = amount;
    if (paymentStatus) subscription.paymentStatus = paymentStatus;

    await subscription.save();

    const updatedSubscription = await Subscription.findById(id).populate(
      "userId",
      "name email role"
    );

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Subscription updated successfully",
      data: updatedSubscription,
    });
  } catch (error) {
    next(error);
  }
};


// DELETE /api/subscriptions/:id - Delete subscription (admin only)
export const deleteSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findByIdAndDelete(id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Subscription not found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Subscription deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const createUserSubscription = async (req, res, next) => {
  try {
    const { plan_name, start_date, end_date, amount } = req.body;
    const userType = req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1);

    if (!plan_name || !end_date) {
      return res.status(400).json({
        success: false,
        message: "Plan name and end date are required",
      });
    }

    if (amount === undefined || amount === null) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    const Model = userType === "Provider" ? Provider : Customer;
    const user = await Model.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const subscription = new Subscription({
      userId: req.user.id,
      userType,
      plan_name,
      start_date: start_date || new Date(),
      end_date,
      status: "Active",
      amount,
      paymentStatus: amount > 0 ? "pending" : "paid",
      paidAt: amount === 0 ? new Date() : null,
    });

    await subscription.save();

    if (amount === 0) {
      await Model.findByIdAndUpdate(req.user.id, {
        currentSubscriptionId: subscription._id,
      });
    }

    const populatedSubscription = await Subscription.findById(
      subscription._id
    ).populate("userId", "name email role");

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: amount > 0 
        ? "Subscription created successfully. Please complete payment to activate."
        : "Free subscription created and activated successfully.",
      data: populatedSubscription,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/subscriptions/admin-summary
 * Specific endpoint for admin to see all users and their subscription status
 */
export const getSubscriptionsAdminSummary = async (req, res, next) => {
  try {
    const providers = await Provider.find().populate('currentSubscriptionId');
    const customers = await Customer.find().populate('currentSubscriptionId');

    const formatUser = (user, type) => {
      const sub = user.currentSubscriptionId;
      let status = 'Trial';
      
      const trialPeriodDays = 30;
      const trialExpirationDate = new Date(user.createdAt);
      trialExpirationDate.setDate(trialExpirationDate.getDate() + trialPeriodDays);
      
      const isTrialExpired = new Date() > trialExpirationDate;

      if (sub && sub.status === 'Active' && sub.paymentStatus === 'paid' && new Date(sub.end_date) > new Date()) {
        status = 'Active';
      } else if (isTrialExpired) {
        status = 'Expired';
      }

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        type,
        createdAt: user.createdAt,
        trialExpiresAt: trialExpirationDate,
        subscription: sub ? {
          plan: sub.plan_name,
          status: sub.status,
          startDate: sub.start_date,
          endDate: sub.end_date,
          paymentStatus: sub.paymentStatus
        } : null,
        status
      };
    };

    const summary = [
      ...providers.map(p => formatUser(p, 'Provider')),
      ...customers.map(c => formatUser(c, 'Customer'))
    ];

    return res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};
