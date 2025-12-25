import express from "express";
import { verifyRole, verifyToken } from "../middleware/authMiddleware.js";
import {
  handleWebhook,
  createSubscriptionPayment,
  getUserSubscriptionStatus,
} from "../controllers/paymentsController.js";

const paymentsRouter = express.Router();

paymentsRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

paymentsRouter.post(
  "/subscription-payment",
  verifyToken,
  verifyRole("provider", "customer"),
  createSubscriptionPayment
);

paymentsRouter.get(
  "/user-subscription",
  verifyToken,
  verifyRole("provider", "customer"),
  getUserSubscriptionStatus
);

export default paymentsRouter;
