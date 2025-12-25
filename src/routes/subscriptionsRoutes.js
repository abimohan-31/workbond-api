import express from "express";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";
import {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  createUserSubscription,
  getSubscriptionsAdminSummary,
} from "../controllers/subscriptionsController.js";

const subscriptionsRouter = express.Router();

// All routes require authentication
subscriptionsRouter.use(verifyToken);

// GET routes
// Admin: Can view all subscriptions and summary
subscriptionsRouter.get("/admin-summary", verifyRole("admin"), getSubscriptionsAdminSummary);
subscriptionsRouter.get("/", verifyRole("admin", "provider", "customer"), getAllSubscriptions);
subscriptionsRouter.get("/:id", verifyRole("admin", "provider", "customer"), getSubscriptionById);

// POST, PUT, DELETE routes (admin only)
subscriptionsRouter.post("/", verifyRole("admin"), createSubscription);

// User self-subscription route
subscriptionsRouter.post("/subscribe", verifyRole("provider", "customer"), createUserSubscription);

subscriptionsRouter.put("/:id", verifyRole("admin"), updateSubscription);
subscriptionsRouter.delete("/:id", verifyRole("admin"), deleteSubscription);

export default subscriptionsRouter;
