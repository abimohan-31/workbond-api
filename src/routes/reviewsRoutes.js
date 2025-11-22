import express from "express";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewsController.js";

const reviewsRouter = express.Router();

// Public routes (no authentication required)
reviewsRouter.get("/", getAllReviews);
reviewsRouter.get("/:id", getReviewById);

//customer
reviewsRouter.post("/", createReview);
reviewsRouter.put("/:id", updateReview);
reviewsRouter.delete("/:id", deleteReview);

export default reviewsRouter;
