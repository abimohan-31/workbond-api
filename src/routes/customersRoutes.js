import express from "express";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";
import {
  getProfile,
  updateProfile,
  getAllProviders,
  getProviderById,
} from "../controllers/customersController.js";
import {
  createReview,
  deleteReview,
  updateReview,
} from "../controllers/reviewsController.js";
import {
  getAllServices,
  getProvidersByService,
  getServiceById,
} from "../controllers/servicesController.js";

const customersRouter = express.Router();



// Profile routes
customersRouter.get("/profile", getProfile);
customersRouter.put("/profile", updateProfile);

// Provider viewing routes
customersRouter.get("/providers", getAllProviders);
customersRouter.get("/providers/:id", getProviderById);
customersRouter.get("/services", getAllServices);
customersRouter.get("/services/:id", getServiceById);
customersRouter.get("/services/:id/providers", getProvidersByService);



export default customersRouter;
