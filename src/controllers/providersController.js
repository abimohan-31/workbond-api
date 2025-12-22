import Provider from "../models/Provider.js";
import Subscription from "../models/Subscription.js";
import Review from "../models/Review.js";
import Notification from "../models/Notification.js";
import {
  sendApprovalEmail,
  sendRejectionEmail,
} from "../utils/emailService.js";

// GET /api/providers/check-approval/:id - Check approval status by provider ID (public route)
// Allows providers to check their approval status without authentication
export const checkApprovalStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Provider ID is required",
        errors: [{ field: "id", message: "Provider ID is required" }],
      });
    }

    const provider = await Provider.findById(id).select("-password");

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    // Determine status message
    let statusMessage = "";
    if (provider.isApproved) {
      statusMessage =
        "Your account is approved. You can now log in and access all provider features.";
    } else {
      statusMessage =
        "Your account is pending approval. Please wait for admin approval before you can log in.";
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        isApproved: provider.isApproved,
        status: provider.isApproved ? "Approved" : "Pending",
        message: statusMessage,
        provider: {
          _id: provider._id,
          name: provider.name,
          email: provider.email,
          isApproved: provider.isApproved,
          createdAt: provider.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/providers/profile - Get provider profile
export const getProfile = async (req, res, next) => {
  try {
    const provider = await Provider.findById(req.user.id).select("-password");

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        provider,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/providers/profile - Update provider profile
export const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      address,
      experience_years,
      skills,
      availability_status,
      profileImage,
    } = req.body;

    const provider = await Provider.findById(req.user.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    if (name) provider.name = name;
    if (phone) provider.phone = phone;
    if (address) provider.address = address;
    if (experience_years) provider.experience_years = experience_years;
    if (skills) provider.skills = skills;
    if (availability_status) provider.availability_status = availability_status;
    if (profileImage !== undefined) provider.profileImage = profileImage;

    await provider.save();

    const providerData = provider.toObject();
    delete providerData.password;

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profile updated successfully",
      data: {
        provider: providerData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/providers/subscription - Get provider subscription
export const getSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({
      provider_id: req.user.id,
    })
      .populate("provider_id", "name email")
      .sort({ createdAt: -1 });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "No subscription found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/providers/reviews - Get provider reviews
export const getReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 25, q = "" } = req.query;

    const filter = {
      isActive: true,
      $or: [
        { name: { $regex: q } },
        { email: { $regex: q } },
        { phone: { $regex: q } },
      ],
    };

    const reviews = await Review.find({ provider_id: req.user.id }, filter)
      .populate("customer_id", "name email")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ review_date: -1 });

    const total = await Review.countDocuments({ provider_id: req.user.id });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/providers/public - Get all approved providers (public route)
export const getAllProviders = async (req, res, next) => {
  try {
    const { page = 1, limit = 25, q = "", skills = "" } = req.query;

    const filter = {
      isApproved: true,
      $and: [
        {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
            { phone: { $regex: q, $options: "i" } },
          ],
        },
      ],
    };

    if (skills) {
      const skillArray = skills.split(",").map((s) => s.trim());
      filter.$and.push({
        skills: { $in: skillArray.map((s) => new RegExp(s, "i")) },
      });
    }
    const providers = await Provider.find(filter)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ rating: -1, createdAt: -1 });

    const total = await Provider.countDocuments(filter);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        providers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/providers/public/:id - Get provider by ID (public route)
export const getProviderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const provider = await Provider.findOne({
      _id: id,
      isApproved: true,
    }).select("-password");

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        provider,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/providers/admin/all - Get all providers for admin (including pending)
export const getAllProvidersForAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 25, q = "" } = req.query;

    const filter = {
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
      ],
    };

    const providers = await Provider.find(filter)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Provider.countDocuments(filter);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: providers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/providers/:id/approve - Approve a provider (admin only)
export const approveProvider = async (req, res, next) => {
  try {
    const { id } = req.params;

    const provider = await Provider.findById(id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    provider.isApproved = true;
    await provider.save();

    // Send email
    await sendApprovalEmail(provider.email, provider.name);

    // Create notification
    await Notification.create({
      recipient: provider._id,
      recipientModel: "Provider",
      type: "success",
      message: "Congratulations! Your account has been approved.",
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Provider approved successfully",
      data: {
        provider: {
          _id: provider._id,
          name: provider.name,
          email: provider.email,
          isApproved: provider.isApproved,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/providers/:id - Delete/reject a provider (admin only)
export const deleteProvider = async (req, res, next) => {
  try {
    const { id } = req.params;

    const provider = await Provider.findByIdAndDelete(id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Provider deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const banProvider = async (req, res, next) => {
  try {
    const { id } = req.params;

    const provider = await Provider.findByIdAndUpdate(
      id,
      { account_status: "inactive" },
      { new: true }
    ).select("-password");

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Provider banned successfully",
      data: { provider },
    });
  } catch (error) {
    next(error);
  }
};

export const activateProvider = async (req, res, next) => {
  try {
    const { id } = req.params;

    const provider = await Provider.findByIdAndUpdate(
      id,
      { account_status: "active" },
      { new: true }
    ).select("-password");

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Provider activated successfully",
      data: { provider },
    });
  } catch (error) {
    next(error);
  }
};


// PUT /api/providers/:id/reject - Reject a provider (admin only)
export const rejectProvider = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const provider = await Provider.findById(id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    provider.isApproved = false;
    await provider.save();

    // Send email
    await sendRejectionEmail(provider.email, provider.name, reason);

    // Create notification
    await Notification.create({
      recipient: provider._id,
      recipientModel: "Provider", // Assuming providers are also Users or handled here
      type: "error",
      message: `Your account application was rejected. Reason: ${
        reason || "No reason provided"
      }`,
    });

    const providerData = provider.toObject();
    delete providerData.password;

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: reason
        ? `Provider rejected. Reason: ${reason}`
        : "Provider rejected successfully",
      data: {
        provider: providerData,
        rejectionReason: reason || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/providers/profile/image - Update profile image
export const updateProfileImage = async (req, res, next) => {
  try {
    const { profileImage } = req.body;

    if (!profileImage) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Profile image URL is required",
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

    provider.profileImage = profileImage;
    await provider.save();

    const providerData = provider.toObject();
    delete providerData.password;

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profile image updated successfully",
      data: {
        provider: providerData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/providers/profile/image - Delete profile image
export const deleteProfileImage = async (req, res, next) => {
  try {
    const provider = await Provider.findById(req.user.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    provider.profileImage = null;
    await provider.save();

    const providerData = provider.toObject();
    delete providerData.password;

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profile image deleted successfully",
      data: {
        provider: providerData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/providers/work-images - Create work image
export const createWorkImage = async (req, res, next) => {
  try {
    const { title, description, beforeImage, afterImage, category } = req.body;

    if (!title || !beforeImage || !afterImage) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Title, before image, and after image are required",
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

    const workImage = {
      title,
      description: description || "",
      beforeImage,
      afterImage,
      category: category || "",
      createdAt: new Date(),
    };

    provider.workImages.push(workImage);
    await provider.save();

    const addedImage = provider.workImages[provider.workImages.length - 1];

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Work image created successfully",
      data: {
        workImage: addedImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/providers/work-images - Get all work images for logged-in provider
export const getAllWorkImages = async (req, res, next) => {
  try {
    const provider = await Provider.findById(req.user.id).select("workImages");

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        workImages: provider.workImages || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/providers/work-images/:id - Get single work image
export const getWorkImageById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const provider = await Provider.findById(req.user.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    const workImage = provider.workImages.id(id);

    if (!workImage) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Work image not found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        workImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/providers/work-images/:id - Update work image
export const updateWorkImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, beforeImage, afterImage, category } = req.body;

    const provider = await Provider.findById(req.user.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    const workImage = provider.workImages.id(id);

    if (!workImage) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Work image not found",
      });
    }

    if (title) workImage.title = title;
    if (description !== undefined) workImage.description = description;
    if (beforeImage) workImage.beforeImage = beforeImage;
    if (afterImage) workImage.afterImage = afterImage;
    if (category !== undefined) workImage.category = category;

    await provider.save();

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Work image updated successfully",
      data: {
        workImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/providers/work-images/:id - Delete work image
export const deleteWorkImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const provider = await Provider.findById(req.user.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found",
      });
    }

    const workImage = provider.workImages.id(id);

    if (!workImage) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Work image not found",
      });
    }

    workImage.deleteOne();
    await provider.save();

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Work image deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/providers/public/:providerId/work-images - Get work images for public viewing
export const getPublicWorkImages = async (req, res, next) => {
  try {
    const { providerId } = req.params;

    const provider = await Provider.findOne({
      _id: providerId,
      isApproved: true,
    }).select("workImages name");

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider not found or not approved",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        providerName: provider.name,
        workImages: provider.workImages || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/providers/pending - Get pending providers
export const getPendingProviders = async (req, res, next) => {
  try {
    const { page = 1, limit = 25, q = "" } = req.query;

    const filter = {
      isApproved: false,
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
      ],
    };

    const providers = await Provider.find(filter)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Provider.countDocuments(filter);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        providers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/providers/work-entries - Create work entry after completing a job
// This allows providers to post their work anytime after finishing a job
export const createWorkEntryAfterCompletion = async (req, res, next) => {
  try {
    // Extract all the work details from the request body
    const {
      title,
      description,
      beforeImage,
      afterImage,
      category,
      WorkPostId,
      completedAt,
      customerFeedback,
    } = req.body;

    // Validate that required fields are provided
    // Title, before image, and after image are mandatory for any work entry
    if (!title || !beforeImage || !afterImage) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message:
          "Title, before image, and after image are required to create a work entry",
      });
    }

    // Find the provider making the request using their authenticated user ID
    const provider = await Provider.findById(req.user.id);

    // Check if provider exists in the database
    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider account not found",
      });
    }

    // If job post ID is provided, validate that the job exists and provider completed it
    // This ensures providers can only link work to jobs they actually finished
    if (WorkPostId) {
      const WorkPost = (await import("../models/WorkPost.js")).default;
      const workPost = await WorkPost.findById(WorkPostId);

      // Check if the job post exists in the system
      if (!workPost) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message:
            "Work post not found. Cannot link work entry to non-existent job.",
        });
      }

      // Verify that this provider was approved for and completed this job
      // Prevents providers from claiming work on jobs they didn't do
      const application = workPost.applications.find(
        (app) =>
          app.providerId.toString() === req.user.id &&
          app.status === "completed"
      );

      if (!application) {
        return res.status(403).json({
          success: false,
          statusCode: 403,
          message:
            "You can only post  for work you have completed. This job is not marked as completed by you.",
        });
      }
    }

    // Create the work entry object with all provided information
    // Use current date for completion if not provided
    const workEntry = {
      title,
      description: description || "",
      beforeImage,
      afterImage,
      category: category || "",
      WorkPostId: WorkPostId || null,
      completedAt: completedAt ? new Date(completedAt) : new Date(),
      customerFeedback: customerFeedback || "",
      createdAt: new Date(),
    };

    // Add the work entry to the provider's portfolio
    provider.workImages.push(workEntry);

    // Save the provider document with the new work entry
    await provider.save();

    // Get the newly added work entry to return in response
    // We get the last item since we just pushed it
    const addedWorkEntry = provider.workImages[provider.workImages.length - 1];

    // Return success response with the created work entry
    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Work entry created successfully and added to your portfolio",
      data: {
        workEntry: addedWorkEntry,
      },
    });
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
};

// GET /api/providers/work-entries - Get all work entries for logged-in provider
// Enhanced version that can filter by job completion status
export const getAllWorkEntries = async (req, res, next) => {
  try {
    // Get optional query parameters for filtering
    // Allows providers to filter their work entries by various criteria
    const { hasJobReference, category, sortBy = "newest" } = req.query;

    // Find the provider and get their work images
    const provider = await Provider.findById(req.user.id).select("workImages");

    // Check if provider exists
    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider account not found",
      });
    }

    // Start with all work images
    let workEntries = provider.workImages || [];

    // Filter by job reference if requested
    // Helps providers see which work entries are linked to completed jobs
    if (hasJobReference === "true") {
      workEntries = workEntries.filter((entry) => entry.WorkPostId !== null);
    } else if (hasJobReference === "false") {
      workEntries = workEntries.filter((entry) => entry.WorkPostId === null);
    }

    // Filter by category if provided
    // Allows providers to organize their work by service type
    if (category) {
      workEntries = workEntries.filter(
        (entry) => entry.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Sort work entries based on user preference
    // Newest first shows recent work, oldest first shows career progression
    if (sortBy === "newest") {
      workEntries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      workEntries.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "completion") {
      workEntries.sort((a, b) => {
        const dateA = a.completedAt || a.createdAt;
        const dateB = b.completedAt || b.createdAt;
        return new Date(dateB) - new Date(dateA);
      });
    }

    // Return the filtered and sorted work entries
    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        workEntries,
        totalCount: workEntries.length,
        filters: {
          hasJobReference: hasJobReference || "all",
          category: category || "all",
          sortBy,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/providers/work-entries/from-jobs - Get work entries linked to completed jobs
// Special endpoint to see only work that was posted after job completion
export const getWorkEntriesFromCompletedJobs = async (req, res, next) => {
  try {
    // Find provider and get work entries that have job references
    const provider = await Provider.findById(req.user.id).select("workImages");

    if (!provider) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Provider account not found",
      });
    }

    // Filter to only work entries that are linked to completed jobs
    const workEntriesWithJobs = provider.workImages.filter(
      (entry) => entry.WorkPostId !== null
    );

    // Populate job details for each work entry
    // This gives providers full context about the jobs their work came from
    const WorkPost = (await import("../models/WorkPost.js")).default;
    const populatedEntries = await Promise.all(
      workEntriesWithJobs.map(async (entry) => {
        const workPost = await WorkPost.findById(entry.WorkPostId)
          .populate("service_id", "name category")
          .populate("customerId", "name email");

        return {
          ...entry.toObject(),
          jobDetails: workPost
            ? {
                title: workPost.title,
                service: workPost.service_id,
                customer: workPost.customerId,
                completedAt: entry.completedAt,
              }
            : null,
        };
      })
    );

    // Return work entries with their associated job information
    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        workEntries: populatedEntries,
        totalCount: populatedEntries.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
