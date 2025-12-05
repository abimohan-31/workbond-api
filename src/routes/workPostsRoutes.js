import express from "express";
import { verifyRole, verifyToken } from "../middleware/authMiddleware.js";
import {
  createWorkPost,
  deleteWorkPost,
  getAllWorkPosts,
  getWorkPostById,
  updateWorkPost,
  getWorkPostsByProvider,
  getWorkPostsByJobPost,
} from "../controllers/workPostsController.js";

const workPostsRouter = express.Router();

// Get all work posts - providers see their own, others see public ones
workPostsRouter.get(
  "/",
  verifyToken,
  verifyRole(["customer", "provider", "admin"]),
  getAllWorkPosts
);

// Get work post by ID
workPostsRouter.get(
  "/:id",
  verifyToken,
  verifyRole(["customer", "provider", "admin"]),
  getWorkPostById
);

// Create work post - provider only
workPostsRouter.post("/", verifyToken, verifyRole("provider"), createWorkPost);

// Update work post - provider can update their own, admin can update any
workPostsRouter.put("/:id", verifyToken, verifyRole("provider"), updateWorkPost);

// Delete work post - provider can delete their own, admin can delete any
workPostsRouter.delete(
  "/:id",
  verifyToken,
  verifyRole("provider"),
  deleteWorkPost
);

// Get work posts by provider ID - public endpoint
workPostsRouter.get(
  "/provider/:providerId",
  verifyToken,
  verifyRole(["customer", "provider", "admin"]),
  getWorkPostsByProvider
);

// Get work posts by job post ID - public endpoint
workPostsRouter.get(
  "/job/:jobPostId",
  verifyToken,
  verifyRole(["customer", "provider", "admin"]),
  getWorkPostsByJobPost
);

export default workPostsRouter;

