import express from "express";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";
import {
  getAllJobPosts,
  getJobPostById,
  createJobPost,
  updateJobPost,
  applyToJobPost,
  approveApplication,
  rejectApplication,
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
jobPostsRouter.put("/:id", updateJobPost); // Customer (own) or Admin (any)
jobPostsRouter.put(
  "/:id/applications/:applicationId/approve",
  verifyRole("customer"),
  approveApplication
);
jobPostsRouter.put(
  "/:id/applications/:applicationId/reject",
  verifyRole("customer"),
  rejectApplication
);

// DELETE routes
jobPostsRouter.delete("/:id", deleteJobPost); // Customer (own) or Admin (any)

export default jobPostsRouter;
