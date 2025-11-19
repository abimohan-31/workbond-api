import express from "express";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";
import {
  getAllJobPosts,
  getJobPostById,
  createJobPost,
  updateJobPost,
  approveJobPost,
  rejectJobPost,
  applyToJobPost,
  deleteJobPost,
} from "../controllers/jobPostsController.js";

const jobPostsRouter = express.Router();

// All routes require authentication
jobPostsRouter.use(verifyToken);

// GET routes - accessible by authenticated users (role-based filtering in controller)
jobPostsRouter.get("/", getAllJobPosts);
jobPostsRouter.get("/:id", getJobPostById);

// POST routes
jobPostsRouter.post("/", verifyRole("customer"), createJobPost);
jobPostsRouter.post("/:id/apply", verifyRole("provider"), applyToJobPost);

// PUT routes
jobPostsRouter.put("/:id", updateJobPost); // Customer (own pending) or Admin (any)
jobPostsRouter.put("/:id/approve", verifyRole("admin"), approveJobPost);
jobPostsRouter.put("/:id/reject", verifyRole("admin"), rejectJobPost);

// DELETE routes
jobPostsRouter.delete("/:id", verifyRole("admin"), deleteJobPost);

export default jobPostsRouter;
