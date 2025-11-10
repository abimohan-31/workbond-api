import Provider from "../models/Provider.js";
import Customer from "../models/Customer.js";
import User from "../models/User.js";
import Subscription from "../models/Subscription.js";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";

// Get all providers (for admin)
export const getAllProviders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const providers = await Provider.find()
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Provider.countDocuments();

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

// Get all customers (for admin)
export const getAllCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const customers = await Customer.find()
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Customer.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        customers,
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
      message: error.message || "Error fetching customers",
    });
  }
};

// Get all admins (for admin)
export const getAllAdmins = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const admins = await User.find({ role: "admin" })
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments({ role: "admin" });

    res.status(200).json({
      success: true,
      data: {
        admins,
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
      message: error.message || "Error fetching admins",
    });
  }
};

// Approve provider
export const approveProvider = async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await Provider.findById(id);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }

    if (provider.isApproved) {
      return res.status(400).json({
        success: false,
        message: "Provider is already approved",
      });
    }

    provider.isApproved = true;
    await provider.save();

    const providerData = provider.toObject();
    delete providerData.password;

    res.status(200).json({
      success: true,
      message:
        "Provider approved successfully. The provider can now log in and access all provider features.",
      data: {
        provider: providerData,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error approving provider",
    });
  }
};

// Reject provider (set isApproved to false and revoke access)
export const rejectProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body; // Optional rejection reason

    const provider = await Provider.findById(id);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }

    provider.isApproved = false;
    await provider.save();

    const providerData = provider.toObject();
    delete providerData.password;

    res.status(200).json({
      success: true,
      message: reason
        ? `Provider rejected successfully. Reason: ${reason}`
        : "Provider rejected successfully. The provider can no longer access provider features.",
      data: {
        provider: providerData,
        rejectionReason: reason || null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error rejecting provider",
    });
  }
};

// Get pending providers
export const getPendingProviders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const providers = await Provider.find({ isApproved: false })
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Provider.countDocuments({ isApproved: false });

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
      message: error.message || "Error fetching pending providers",
    });
  }
};

// Get provider by ID
export const getProviderById = async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await Provider.findById(id).select("-password");

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

// Get customer by ID
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id).select("-password");

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        customer,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching customer",
    });
  }
};

// Delete provider
export const deleteProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await Provider.findByIdAndDelete(id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Provider deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error deleting provider",
    });
  }
};

// Delete customer
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error deleting customer",
    });
  }
};

// Get all subscriptions (for admin)
export const getAllSubscriptions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const subscriptions = await Subscription.find()
      .populate("provider_id", "name email")
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Subscription.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        subscriptions,
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
      message: error.message || "Error fetching subscriptions",
    });
  }
};

// Get all bookings (for admin)
export const getAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const bookings = await Booking.find()
      .populate("customer", "name email phone")
      .populate("provider", "name skills")
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Booking.countDocuments();

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

// Get all reviews (for admin)
export const getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const reviews = await Review.find()
      .populate("customer_id", "name email")
      .populate("provider_id", "name skills")
      .populate("booking_id", "booking_date")
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Review.countDocuments();

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
