// ============================================================================
// COMPLETE SEPARATED SOLUTION: JobPost and WorkPost
// ============================================================================
// This file contains all separated models, controllers, and routes
// Copy and paste each section into the appropriate files
// ============================================================================

// ============================================================================
// 1. JOB POST MODEL (src/models/JobPost.js)
// ============================================================================
// Represents jobs posted by customers - focused on job postings only
// ============================================================================

import mongoose from "mongoose";
import Service from "./Service.js";
import Customer from "./Customer.js";
import Provider from "./Provider.js";

const jobPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
    },
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Service,
      required: [true, "Service is required"],
      index: true,
    },
    location: {
      type: String,
      trim: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Customer,
      required: [true, "Customer ID is required"],
      index: true,
    },
    applications: [
      {
        providerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Provider,
          required: true,
        },
        status: {
          type: String,
          enum: ["applied", "approved", "rejected"],
          default: "applied",
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    jobStatus: {
      type: String,
      enum: ["open", "in_progress", "completed", "cancelled"],
      default: "open",
    },
    assignedProviderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Provider,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

jobPostSchema.index({ service_id: 1 });
jobPostSchema.index({ customerId: 1 });
jobPostSchema.index({ "applications.providerId": 1 });

export default mongoose.model("JobPost", jobPostSchema);

// ============================================================================
// 2. WORK POST MODEL (src/models/WorkPost.js)
// ============================================================================
// Represents completed works posted by service providers
// ============================================================================

import mongoose from "mongoose";
import Provider from "./Provider.js";
import JobPost from "./JobPost.js";
import Service from "./Service.js";
import Customer from "./Customer.js";

const workPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Work title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    beforeImage: {
      type: String,
      required: [true, "Before image is required"],
    },
    afterImage: {
      type: String,
      required: [true, "After image is required"],
    },
    category: {
      type: String,
      default: "",
      trim: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Provider,
      required: [true, "Provider ID is required"],
      index: true,
    },
    jobPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: JobPost,
      default: null,
      index: true,
    },
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Service,
      default: null,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Customer,
      default: null,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
    customerFeedback: {
      type: String,
      default: "",
      trim: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

workPostSchema.index({ providerId: 1 });
workPostSchema.index({ jobPostId: 1 });
workPostSchema.index({ category: 1 });
workPostSchema.index({ createdAt: -1 });

export default mongoose.model("WorkPost", workPostSchema);

// ============================================================================
// 3. JOB POST CONTROLLER (src/controllers/jobPostsController.js)
// ============================================================================
// Handles CRUD operations for customer job posts only
// ============================================================================

import JobPost from "../models/JobPost.js";
import Service from "../models/Service.js";
import Customer from "../models/Customer.js";
import Provider from "../models/Provider.js";
import { queryHelper } from "../utils/queryHelper.js";

export const getAllJobPosts = async (req, res, next) => {
  try {
    let defaultFilters = {};

    if (req.user.role === "customer") {
      defaultFilters.customerId = req.user.id;
    }

    const { data, pagination } = await queryHelper(
      JobPost,
      req.query,
      ["title", "description", "location", "duration"],
      {
        defaultFilters,
        populate: [
          { path: "service_id", select: "name category description" },
          { path: "customerId", select: "name email phone" },
          {
            path: "applications.providerId",
            select: "name email skills phone",
          },
        ],
      }
    );

    return res.status(200).json({
      success: true,
      data,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const jobPost = await JobPost.findById(id)
      .populate("service_id", "name category description")
      .populate("customerId", "name email phone address")
      .populate("applications.providerId", "name email skills phone");

    if (!jobPost) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Job post not found",
      });
    }

    if (req.user.role === "customer") {
      if (jobPost.customerId._id.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          statusCode: 403,
          message: "You can only view your own job posts",
        });
      }
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        jobPost,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createJobPost = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Only customers can create job posts",
      });
    }

    const { title, description, duration, service_id, location } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Job title is required",
        errors: [{ field: "title", message: "Job title is required" }],
      });
    }

    if (!description) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Job description is required",
        errors: [
          { field: "description", message: "Job description is required" },
        ],
      });
    }

    if (!duration) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Duration is required",
        errors: [{ field: "duration", message: "Duration is required" }],
      });
    }

    if (!service_id) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Service is required",
        errors: [{ field: "service_id", message: "Service is required" }],
      });
    }

    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Customer not found",
      });
    }

    if (!customer.phone) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message:
          "Phone number is required to post jobs. Please update your profile.",
        errors: [{ field: "phone", message: "Phone number is required" }],
      });
    }

    const service = await Service.findById(service_id);
    if (!service) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Service not found",
      });
    }

    const jobPost = new JobPost({
      title,
      description,
      duration,
      service_id,
      location,
      customerId: req.user.id,
      applications: [],
    });

    await jobPost.save();

    const populatedJobPost = await JobPost.findById(jobPost._id)
      .populate("service_id", "name category description")
      .populate("customerId", "name email phone");

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Job post created successfully. It is now visible to providers.",
      data: {
        jobPost: populatedJobPost,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateJobPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, duration, service_id, location } = req.body;

    const jobPost = await JobPost.findById(id);

    if (!jobPost) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Job post not found",
      });
    }

    if (req.user.role !== "admin") {
      if (req.user.role !== "customer") {
        return res.status(403).json({
          success: false,
          statusCode: 403,
          message: "Only customers and admins can update job posts",
        });
      }

      if (jobPost.customerId.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          statusCode: 403,
          message: "You can only update your own job posts",
        });
      }
    }

    if (title) jobPost.title = title;
    if (description) jobPost.description = description;
    if (duration) jobPost.duration = duration;
    if (location !== undefined) jobPost.location = location;

    if (service_id) {
      const service = await Service.findById(service_id);
      if (!service) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Service not found",
        });
      }
      jobPost.service_id = service_id;
    }

    await jobPost.save();

    const populatedJobPost = await JobPost.findById(jobPost._id)
      .populate("service_id", "name category description")
      .populate("customerId", "name email phone")
      .populate("applications.providerId", "name email skills");

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Job post updated successfully",
      data: {
        jobPost: populatedJobPost,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJobPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const jobPost = await JobPost.findById(id);

    if (!jobPost) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Job post not found",
      });
    }

    if (req.user.role !== "admin") {
      if (req.user.role !== "customer") {
        return res.status(403).json({
          success: false,
          statusCode: 403,
          message: "Only customers and admins can delete job posts",
        });
      }

      if (jobPost.customerId.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          statusCode: 403,
          message: "You can only delete your own job posts",
        });
      }
    }

    await JobPost.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Job post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const applyToJobPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.user || req.user.role !== "provider") {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Only providers can apply to job posts",
      });
    }

    const jobPost = await JobPost.findById(id);

    if (!jobPost) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Job post not found",
      });
    }

    const existingApplication = jobPost.applications.find(
      (app) => app.providerId.toString() === req.user.id
    );

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "You have already applied to this job post",
      });
    }

    jobPost.applications.push({
      providerId: req.user.id,
      status: "applied",
      appliedAt: new Date(),
    });

    await jobPost.save();

    const populatedJobPost = await JobPost.findById(jobPost._id)
      .populate("service_id", "name category description")
      .populate("customerId", "name email phone")
      .populate("applications.providerId", "name email skills phone");

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        "Successfully applied to job post. Waiting for customer approval.",
      data: {
        jobPost: populatedJobPost,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const approveApplication = async (req, res, next) => {
  try {
    const { id, applicationId } = req.params;

    if (!req.user || req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Only customers can approve applications",
      });
    }

    const jobPost = await JobPost.findById(id);

    if (!jobPost) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Job post not found",
      });
    }

    if (jobPost.customerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "You can only approve applications for your own job posts",
      });
    }

    const application = jobPost.applications.id(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Application not found",
      });
    }

    if (application.status === "approved") {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Application is already approved",
      });
    }

    application.status = "approved";
    jobPost.jobStatus = "in_progress";
    jobPost.assignedProviderId = application.providerId;
    await jobPost.save();

    const populatedJobPost = await JobPost.findById(jobPost._id)
      .populate("service_id", "name category description")
      .populate("customerId", "name email phone")
      .populate("applications.providerId", "name email skills phone");

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Application approved successfully",
      data: {
        jobPost: populatedJobPost,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const rejectApplication = async (req, res, next) => {
  try {
    const { id, applicationId } = req.params;

    if (!req.user || req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Only customers can reject applications",
      });
    }

    const jobPost = await JobPost.findById(id);

    if (!jobPost) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Job post not found",
      });
    }

    if (jobPost.customerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "You can only reject applications for your own job posts",
      });
    }

    const application = jobPost.applications.id(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Application not found",
      });
    }

    if (application.status === "rejected") {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Application is already rejected",
      });
    }

    application.status = "rejected";
    await jobPost.save();

    const populatedJobPost = await JobPost.findById(jobPost._id)
      .populate("service_id", "name category description")
      .populate("customerId", "name email phone")
      .populate("applications.providerId", "name email skills phone");

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Application rejected successfully",
      data: {
        jobPost: populatedJobPost,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const markJobAsCompleted = async (req, res, next) => {
  try {
    const { id } = req.params;

    const jobPost = await JobPost.findById(id);

    if (!jobPost) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Job post not found",
      });
    }

    const application = jobPost.applications.find(
      (app) => app.providerId.toString() === req.user.id
    );

    if (!application || application.status !== "approved") {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "You can only complete jobs you were approved for",
      });
    }

    jobPost.jobStatus = "completed";
    await jobPost.save();

    const populatedJobPost = await JobPost.findById(jobPost._id)
      .populate("service_id", "name category")
      .populate("customerId", "name email")
      .populate("applications.providerId", "name email");

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Job marked as completed. You can now post your work for this job.",
      data: {
        jobPost: populatedJobPost,
        canPostWork: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// 4. WORK POST CONTROLLER (src/controllers/workPostsController.js)
// ============================================================================
// Handles CRUD operations for provider work posts
// ============================================================================

import WorkPost from "../models/WorkPost.js";
import Provider from "../models/Provider.js";
import JobPost from "../models/JobPost.js";
import Service from "../models/Service.js";
import Customer from "../models/Customer.js";
import { queryHelper } from "../utils/queryHelper.js";

export const getAllWorkPosts = async (req, res, next) => {
  try {
    let defaultFilters = {};

    if (req.user.role === "provider") {
      defaultFilters.providerId = req.user.id;
    } else {
      defaultFilters.isPublic = true;
    }

    const { data, pagination } = await queryHelper(
      WorkPost,
      req.query,
      ["title", "description", "category"],
      {
        defaultFilters,
        populate: [
          { path: "providerId", select: "name email skills rating" },
          { path: "jobPostId", select: "title description" },
          { path: "service_id", select: "name category" },
          { path: "customerId", select: "name email" },
        ],
      }
    );

    return res.status(200).json({
      success: true,
      data,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const workPost = await WorkPost.findById(id)
      .populate("providerId", "name email skills rating profileImage")
      .populate("jobPostId", "title description")
      .populate("service_id", "name category")
      .populate("customerId", "name email");

    if (!workPost) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Work post not found",
      });
    }

    if (!workPost.isPublic && workPost.providerId._id.toString() !== req.user.id) {
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          statusCode: 403,
          message: "You do not have permission to view this work post",
        });
      }
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        workPost,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createWorkPost = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "provider") {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Only providers can create work posts",
      });
    }

    const {
      title,
      description,
      beforeImage,
      afterImage,
      category,
      jobPostId,
      customerFeedback,
      isPublic,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Title is required",
        errors: [{ field: "title", message: "Title is required" }],
      });
    }

    if (!beforeImage) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Before image is required",
        errors: [{ field: "beforeImage", message: "Before image is required" }],
      });
    }

    if (!afterImage) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "After image is required",
        errors: [{ field: "afterImage", message: "After image is required" }],
      });
    }

    const provider = await Provider.findById(req.user.id);
    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    let jobPost = null;
    let serviceId = null;
    let customerId = null;

    if (jobPostId) {
      jobPost = await JobPost.findById(jobPostId);
      if (!jobPost) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Job post not found",
        });
      }

      const application = jobPost.applications.find(
        (app) =>
          app.providerId.toString() === req.user.id &&
          app.status === "approved"
      );

      if (!application || jobPost.jobStatus !== "completed") {
        return res.status(403).json({
          success: false,
          statusCode: 403,
          message:
            "You can only post work for jobs you completed. This job is not completed by you.",
        });
      }

      serviceId = jobPost.service_id;
      customerId = jobPost.customerId;
    }

    const workPost = new WorkPost({
      title,
      description: description || "",
      beforeImage,
      afterImage,
      category: category || "",
      providerId: req.user.id,
      jobPostId: jobPostId || null,
      service_id: serviceId,
      customerId: customerId,
      completedAt: new Date(),
      customerFeedback: customerFeedback || "",
      isPublic: isPublic !== undefined ? isPublic : true,
    });

    await workPost.save();

    const populatedWorkPost = await WorkPost.findById(workPost._id)
      .populate("providerId", "name email skills")
      .populate("jobPostId", "title")
      .populate("service_id", "name category")
      .populate("customerId", "name email");

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Work post created successfully",
      data: {
        workPost: populatedWorkPost,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateWorkPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      beforeImage,
      afterImage,
      category,
      customerFeedback,
      isPublic,
    } = req.body;

    const workPost = await WorkPost.findById(id);

    if (!workPost) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Work post not found",
      });
    }

    if (req.user.role !== "admin") {
      if (workPost.providerId.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          statusCode: 403,
          message: "You can only update your own work posts",
        });
      }
    }

    if (title) workPost.title = title;
    if (description !== undefined) workPost.description = description;
    if (beforeImage) workPost.beforeImage = beforeImage;
    if (afterImage) workPost.afterImage = afterImage;
    if (category !== undefined) workPost.category = category;
    if (customerFeedback !== undefined)
      workPost.customerFeedback = customerFeedback;
    if (isPublic !== undefined) workPost.isPublic = isPublic;

    await workPost.save();

    const populatedWorkPost = await WorkPost.findById(workPost._id)
      .populate("providerId", "name email skills")
      .populate("jobPostId", "title")
      .populate("service_id", "name category")
      .populate("customerId", "name email");

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Work post updated successfully",
      data: {
        workPost: populatedWorkPost,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteWorkPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const workPost = await WorkPost.findById(id);

    if (!workPost) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Work post not found",
      });
    }

    if (req.user.role !== "admin") {
      if (workPost.providerId.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          statusCode: 403,
          message: "You can only delete your own work posts",
        });
      }
    }

    await WorkPost.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Work post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkPostsByProvider = async (req, res, next) => {
  try {
    const { providerId } = req.params;

    const { data, pagination } = await queryHelper(
      WorkPost,
      req.query,
      ["title", "description", "category"],
      {
        defaultFilters: {
          providerId,
          isPublic: true,
        },
        populate: [
          { path: "providerId", select: "name email skills rating" },
          { path: "jobPostId", select: "title" },
          { path: "service_id", select: "name category" },
        ],
      }
    );

    return res.status(200).json({
      success: true,
      data,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkPostsByJobPost = async (req, res, next) => {
  try {
    const { jobPostId } = req.params;

    const { data, pagination } = await queryHelper(
      WorkPost,
      req.query,
      ["title", "description"],
      {
        defaultFilters: {
          jobPostId,
          isPublic: true,
        },
        populate: [
          { path: "providerId", select: "name email skills" },
          { path: "jobPostId", select: "title" },
        ],
      }
    );

    return res.status(200).json({
      success: true,
      data,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// 5. JOB POST ROUTES (src/routes/jobPostsRoutes.js)
// ============================================================================
// Routes for customer job posts
// ============================================================================

import express from "express";
import { verifyRole, verifyToken } from "../middleware/authMiddleware.js";
import {
  applyToJobPost,
  approveApplication,
  createJobPost,
  deleteJobPost,
  getAllJobPosts,
  getJobPostById,
  rejectApplication,
  updateJobPost,
  markJobAsCompleted,
} from "../controllers/jobPostsController.js";

const jobPostsRouter = express.Router();

jobPostsRouter.get(
  "/",
  verifyToken,
  verifyRole(["customer", "provider", "admin"]),
  getAllJobPosts
);

jobPostsRouter.get(
  "/:id",
  verifyToken,
  verifyRole(["customer", "provider", "admin"]),
  getJobPostById
);

jobPostsRouter.post("/", verifyToken, verifyRole("customer"), createJobPost);

jobPostsRouter.put("/:id", verifyToken, verifyRole("customer"), updateJobPost);

jobPostsRouter.put(
  "/:id/applications/:applicationId/approve",
  verifyToken,
  verifyRole("customer"),
  approveApplication
);

jobPostsRouter.put(
  "/:id/applications/:applicationId/reject",
  verifyToken,
  verifyRole("customer"),
  rejectApplication
);

jobPostsRouter.delete(
  "/:id",
  verifyToken,
  verifyRole("customer"),
  deleteJobPost
);

jobPostsRouter.post(
  "/:id/apply",
  verifyToken,
  verifyRole("provider"),
  applyToJobPost
);

jobPostsRouter.put(
  "/:id/complete",
  verifyToken,
  verifyRole("provider"),
  markJobAsCompleted
);

export default jobPostsRouter;

// ============================================================================
// 6. WORK POST ROUTES (src/routes/workPostsRoutes.js)
// ============================================================================
// Routes for provider work posts
// ============================================================================

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

workPostsRouter.get(
  "/",
  verifyToken,
  verifyRole(["customer", "provider", "admin"]),
  getAllWorkPosts
);

workPostsRouter.get(
  "/:id",
  verifyToken,
  verifyRole(["customer", "provider", "admin"]),
  getWorkPostById
);

workPostsRouter.post("/", verifyToken, verifyRole("provider"), createWorkPost);

workPostsRouter.put("/:id", verifyToken, verifyRole("provider"), updateWorkPost);

workPostsRouter.delete(
  "/:id",
  verifyToken,
  verifyRole("provider"),
  deleteWorkPost
);

workPostsRouter.get(
  "/provider/:providerId",
  verifyToken,
  verifyRole(["customer", "provider", "admin"]),
  getWorkPostsByProvider
);

workPostsRouter.get(
  "/job/:jobPostId",
  verifyToken,
  verifyRole(["customer", "provider", "admin"]),
  getWorkPostsByJobPost
);

export default workPostsRouter;

// ============================================================================
// 7. MAIN APP ROUTE REGISTRATION (src/app.js or src/index.js)
// ============================================================================
// Add these routes to your main Express app
// ============================================================================

// import jobPostsRouter from "./routes/jobPostsRoutes.js";
// import workPostsRouter from "./routes/workPostsRoutes.js";

// app.use("/api/jobposts", jobPostsRouter);
// app.use("/api/workposts", workPostsRouter);

// ============================================================================
// END OF SEPARATED SOLUTION
// ============================================================================

