import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorizeMiddleware.js";
import {
  getAllProviders,
  getAllCustomers,
  getAllAdmins,
  approveProvider,
  rejectProvider,
  getPendingProviders,
  getProviderById,
  getCustomerById,
  deleteProvider,
  deleteCustomer,
  getAllSubscriptions,
  getAllBookings,
  getAllReviews,
} from "../controllers/AdminController.js";

const adminRouter = express.Router();

// All admin routes require authentication and admin role
adminRouter.use(authenticate);
adminRouter.use(authorize("admin"));

// Provider management
adminRouter.get("/providers", getAllProviders);
adminRouter.get("/providers/pending", getPendingProviders);
adminRouter.get("/providers/:id", getProviderById);
adminRouter.put("/providers/:id/approve", approveProvider);
adminRouter.put("/providers/:id/reject", rejectProvider);
adminRouter.delete("/providers/:id", deleteProvider);

// Customer management
adminRouter.get("/customers", getAllCustomers);
adminRouter.get("/customers/:id", getCustomerById);
adminRouter.delete("/customers/:id", deleteCustomer);

// Admin management
adminRouter.get("/admins", getAllAdmins);

// Subscriptions, bookings, reviews
adminRouter.get("/subscriptions", getAllSubscriptions);
adminRouter.get("/bookings", getAllBookings);
adminRouter.get("/reviews", getAllReviews);

export default adminRouter;

