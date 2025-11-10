import Customer from "../models/Customer.js";
import Provider from "../models/Provider.js";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";
import Subscription from "../models/Subscription.js";

// Get customer profile
export const getCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).select("-password");

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
      message: error.message || "Error fetching customer profile",
    });
  }
};

// Update customer profile
export const updateCustomerProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const customer = await Customer.findById(req.user.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Update allowed fields
    if (name) customer.name = name;
    if (phone) customer.phone = phone;
    if (address) customer.address = address;

    await customer.save();

    const customerData = customer.toObject();
    delete customerData.password;

    res.status(200).json({
      success: true,
      message: "Customer profile updated successfully",
      data: {
        customer: customerData,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error updating customer profile",
    });
  }
};

// Get all providers (for customers to view)
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

// Get provider by ID (for customers to view)
export const getProviderById = async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await Provider.findOne({
      _id: id,
      isApproved: true,
    }).select("-password");

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

// Create booking
export const createBooking = async (req, res) => {
  try {
    const { provider, scheduled_date, total_amount } = req.body;

    if (!provider || !scheduled_date || !total_amount) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required: provider, scheduled_date, total_amount",
      });
    }

    // Verify provider exists and is approved
    const providerExists = await Provider.findOne({
      _id: provider,
      isApproved: true,
    });
    if (!providerExists) {
      return res.status(404).json({
        success: false,
        message: "Provider not found or not approved",
      });
    }

    const booking = new Booking({
      customer: req.user.id,
      provider,
      scheduled_date,
      total_amount,
      status: "Pending",
    });

    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("customer", "name email phone")
      .populate("provider", "name skills");

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        booking: populatedBooking,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error creating booking",
    });
  }
};

// Get customer's bookings
export const getCustomerBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const bookings = await Booking.find({ customer: req.user.id })
      .populate("provider", "name skills email phone")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments({ customer: req.user.id });

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

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOne({ _id: id, customer: req.user.id })
      .populate("customer", "name email phone")
      .populate("provider", "name skills email phone");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        booking,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching booking",
    });
  }
};

// Update booking
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduled_date, status } = req.body;

    const booking = await Booking.findOne({ _id: id, customer: req.user.id });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (scheduled_date) booking.scheduled_date = scheduled_date;
    if (status) booking.status = status;

    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("customer", "name email phone")
      .populate("provider", "name skills email phone");

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: {
        booking: populatedBooking,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error updating booking",
    });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findOne({ _id: id, customer: req.user.id });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = "Cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: {
        booking,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error cancelling booking",
    });
  }
};

// Create review (customer can submit feedback/views)
export const createReview = async (req, res) => {
  try {
    const { booking_id, provider_id, rating, comment } = req.body;

    if (!booking_id || !provider_id || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required: booking_id, provider_id, rating, comment",
      });
    }

    // Verify booking belongs to this customer
    const booking = await Booking.findById(booking_id);
    if (!booking || booking.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Booking not found or does not belong to you",
      });
    }

    const review = new Review({
      booking_id,
      customer_id: req.user.id,
      provider_id,
      rating,
      comment,
    });

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate("customer_id", "name email")
      .populate("provider_id", "name skills")
      .populate("booking_id", "booking_date");

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: {
        review: populatedReview,
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

// Get customer's reviews
export const getCustomerReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const reviews = await Review.find({ customer_id: req.user.id })
      .populate("provider_id", "name skills")
      .populate("booking_id", "booking_date")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ review_date: -1 });

    const total = await Review.countDocuments({ customer_id: req.user.id });

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
