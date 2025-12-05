import express from "express";
import {
  verifyToken,
  verifyRole,
  verifyProviderApproval,
} from "../middleware/authMiddleware.js";
import {
  checkApprovalStatus,
  getProfile,
  updateProfile,
  getAllProviders,
  getProviderById,
  updateProfileImage,
  deleteProfileImage,
  createWorkImage,
  getAllWorkImages,
  getWorkImageById,
  updateWorkImage,
  deleteWorkImage,
  getPublicWorkImages,
  getPendingProviders,
  getAllProvidersForAdmin,
  approveProvider,
  rejectProvider,
  deleteProvider,
  createWorkEntryAfterCompletion,
  getAllWorkEntries,
  getWorkEntriesFromCompletedJobs,
} from "../controllers/providersController.js";

const providersRouter = express.Router();

// Public routes (no authentication required)
providersRouter.get("/public", getAllProviders);
providersRouter.get("/public/:id", getProviderById);
providersRouter.get("/public/:providerId/work-images", getPublicWorkImages);

// Route to check approval status by provider ID (public - no authentication required)
// Allows providers to check their approval status before they can log in
providersRouter.get("/check-approval/:id", checkApprovalStatus);

// Admin routes (must be before verifyProviderApproval middleware)
//get pending providers
providersRouter.get(
  "/pending",
  verifyToken,
  verifyRole("admin"),
  getPendingProviders
);

// Admin routes for providers
providersRouter.get(
  "/admin/all",
  verifyToken,
  verifyRole("admin"),
  getAllProvidersForAdmin
);

providersRouter.patch(
  "/:id/approve",
  verifyToken,
  verifyRole("admin"),
  approveProvider
);

providersRouter.patch(
  "/:id/reject",
  verifyToken,
  verifyRole("admin"),
  rejectProvider
);

providersRouter.delete(
  "/:id",
  verifyToken,
  verifyRole("admin"),
  deleteProvider
);

// Protected routes (require authentication, provider role, and approval)
providersRouter.use(verifyProviderApproval);

// Profile routes (no subscription required)
providersRouter.get(
  "/profile",
  verifyToken,
  verifyRole("provider"),
  getProfile
);
providersRouter.put(
  "/profile",
  verifyToken,
  verifyRole("provider"),
  updateProfile
);

// Profile image routes
providersRouter.patch(
  "/profile/image",
  verifyToken,
  verifyRole("provider"),
  updateProfileImage
);
providersRouter.delete(
  "/profile/image",
  verifyToken,
  verifyRole("provider"),
  deleteProfileImage
);

// Work portfolio routes (legacy endpoints - kept for backward compatibility)
providersRouter.post(
  "/work-images",
  verifyToken,
  verifyRole("provider"),
  createWorkImage
);
providersRouter.get(
  "/work-images",
  verifyToken,
  verifyRole("provider"),
  getAllWorkImages
);
providersRouter.get(
  "/work-images/:id",
  verifyToken,
  verifyRole("provider"),
  getWorkImageById
);
providersRouter.put(
  "/work-images/:id",
  verifyToken,
  verifyRole("provider"),
  updateWorkImage
);
providersRouter.delete(
  "/work-images/:id",
  verifyToken,
  verifyRole("provider"),
  deleteWorkImage
);

// New work entry routes for dynamic post-completion work posting
// Post work entry after completing a job - main endpoint for providers to add work to portfolio
providersRouter.post(
  "/work-entries",
  verifyToken,
  verifyRole("provider"),
  createWorkEntryAfterCompletion
);

// Get all work entries with filtering options - enhanced version with better filtering
providersRouter.get(
  "/work-entries",
  verifyToken,
  verifyRole("provider"),
  getAllWorkEntries
);

// Get work entries that are linked to completed jobs - shows which work came from actual job completions
providersRouter.get(
  "/work-entries/from-jobs",
  verifyToken,
  verifyRole("provider"),
  getWorkEntriesFromCompletedJobs
);

export default providersRouter;
