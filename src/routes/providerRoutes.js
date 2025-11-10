import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorizeMiddleware.js";
import { checkProviderApproval } from "../middleware/providerApprovalMiddleware.js";
import { checkSubscription } from "../middleware/subscriptionMiddleware.js";
import {
  checkApprovalStatus,
  getProviderProfile,
  updateProviderProfile,
  getProviderSubscription,
  getProviderBookings,
  getProviderReviews,
  createReview,
  getAllProviders,
  getProviderById,
} from "../controllers/ProviderController.js";

const providerRouter = express.Router();

// Public routes (no authentication required)
providerRouter.get("/public", getAllProviders);
providerRouter.get("/public/:id", getProviderById);

// Route that requires authentication but NOT approval (for checking approval status)
// This must be defined before the approval middleware is applied
providerRouter.get(
  "/check-approval",
  authenticate,
  authorize("provider"),
  checkApprovalStatus
);

// Apply middleware to all routes below this point
// These routes require: authentication + provider role + approval
providerRouter.use(authenticate);
providerRouter.use(authorize("provider"));
providerRouter.use(checkProviderApproval);

// Profile routes (require approval)
providerRouter.get("/profile", getProviderProfile);
providerRouter.put("/profile", updateProviderProfile);

// Subscription routes (require approval + active subscription)
providerRouter.get("/subscription", getProviderSubscription);

// Booking routes (require approval + active subscription)
providerRouter.get("/bookings", checkSubscription, getProviderBookings);

// Review/Feedback routes (require approval + active subscription)
providerRouter.get("/reviews", checkSubscription, getProviderReviews);
providerRouter.post("/reviews", checkSubscription, createReview);

export default providerRouter;
