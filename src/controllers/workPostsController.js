import WorkPost from "../models/WorkPost.js";
import Provider from "../models/Provider.js";
import JobPost from "../models/JobPost.js";
import Service from "../models/Service.js";
import Customer from "../models/Customer.js";
import { queryHelper } from "../utils/queryHelper.js";

// GET /api/workposts - Get all work posts
// Providers see their own work posts, others see public ones
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

// GET /api/workposts/:id - Get work post by ID
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

    if (
      !workPost.isPublic &&
      workPost.providerId._id.toString() !== req.user.id
    ) {
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

// POST /api/workposts - Create work post (provider only)
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

// PUT /api/workposts/:id - Update work post
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

// DELETE /api/workposts/:id - Delete work post
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

// GET /api/workposts/provider/:providerId - Get work posts by provider
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

// GET /api/workposts/job/:jobPostId - Get work posts by job post
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

