import Provider from "../models/Provider.js";
import Subscription from "../models/Subscription.js";
import Review from "../models/Review.js";
import Booking from "../models/Booking.js";

// Check provider approval status (accessible without approval)
export const checkApprovalStatus = async (req, res) => {
  try {
    const provider = await Provider.findById(req.user.id).select("-password");

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        isApproved: provider.isApproved,
        message: provider.isApproved
          ? "Your account is approved. You can access all provider features."
          : "Your account is pending approval. Please wait for admin approval to access provider features.",
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
    res.status(500).json({
      success: false,
      message: error.message || "Error checking approval status",
    });
  }
};

// Get provider profile
export const getProviderProfile = async (req, res) => {
  try {
    const provider = await Provider.findById(req.user.id).select("-password");

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        provider,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching provider profile",
    });
  }
};

// Update provider profile
export const updateProviderProfile = async (req, res) => {
  try {
    const { name, phone, address, experience_years, skills, availability_status } = req.body;

    const provider = await Provider.findById(req.user.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }

    // Update allowed fields
    if (name) provider.name = name;
    if (phone) provider.phone = phone;
    if (address) provider.address = address;
    if (experience_years) provider.experience_years = experience_years;
    if (skills) provider.skills = skills;
    if (availability_status) provider.availability_status = availability_status;

    await provider.save();

    const providerData = provider.toObject();
    delete providerData.password;

    res.status(200).json({
      success: true,
      message: "Provider profile updated successfully",
      data: {
        provider: providerData,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error updating provider profile",
    });
  }
};

// Get provider's subscription
export const getProviderSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      provider_id: req.user.id,
    })
      .populate("provider_id", "name email")
      .sort({ createdAt: -1 });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "No subscription found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        subscription,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching subscription",
    });
  }
};

// Get provider's bookings
export const getProviderBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const bookings = await Booking.find({ provider: req.user.id })
      .populate("customer", "name email phone")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments({ provider: req.user.id });

    res.status(200).json({
      success: true,
      data: {
        bookings,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching bookings",
    });
  }
};

// Get provider's reviews
export const getProviderReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const reviews = await Review.find({ provider_id: req.user.id })
      .populate("customer_id", "name email")
      .populate("booking_id", "booking_date")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ review_date: -1 });

    const total = await Review.countDocuments({ provider_id: req.user.id });

    res.status(200).json({
      success: true,
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
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching reviews",
    });
  }
};

// Create review (provider can submit feedback/views)
export const createReview = async (req, res) => {
  try {
    const { booking_id, customer_id, rating, comment } = req.body;

    if (!booking_id || !customer_id || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: booking_id, customer_id, rating, comment",
      });
    }

    // Verify booking belongs to this provider
    const booking = await Booking.findById(booking_id);
    if (!booking || booking.provider.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Booking not found or does not belong to you",
      });
    }

    const review = new Review({
      booking_id,
      customer_id,
      provider_id: req.user.id,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: {
        review,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Review already exists for this booking",
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || "Error creating review",
    });
  }
};

// Get all providers (public - for customers to view)
export const getAllProviders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const providers = await Provider.find({ isApproved: true })
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Provider.countDocuments({ isApproved: true });

    res.status(200).json({
      success: true,
      data: {
        providers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching providers",
    });
  }
};

// Get provider by ID (public - for customers to view)
export const getProviderById = async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await Provider.findOne({ _id: id, isApproved: true }).select("-password");

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        provider,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching provider",
    });
  }
};
