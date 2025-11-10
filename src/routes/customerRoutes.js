import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorizeMiddleware.js";
import {
  getCustomerProfile,
  updateCustomerProfile,
  getAllProviders,
  getProviderById,
  createBooking,
  getCustomerBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  createReview,
  getCustomerReviews,
} from "../controllers/CustomerController.js";

const customerRouter = express.Router();

// All customer routes require authentication and customer role
customerRouter.use(authenticate);
customerRouter.use(authorize("customer"));

// Profile routes
customerRouter.get("/profile", getCustomerProfile);
customerRouter.put("/profile", updateCustomerProfile);

// Provider viewing routes
customerRouter.get("/providers", getAllProviders);
customerRouter.get("/providers/:id", getProviderById);

// Booking routes
customerRouter.post("/bookings", createBooking);
customerRouter.get("/bookings", getCustomerBookings);
customerRouter.get("/bookings/:id", getBookingById);
customerRouter.put("/bookings/:id", updateBooking);
customerRouter.put("/bookings/:id/cancel", cancelBooking);

// Review/Feedback routes
customerRouter.post("/reviews", createReview);
customerRouter.get("/reviews", getCustomerReviews);

export default customerRouter;

