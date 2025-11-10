import jwt from "jsonwebtoken";
import Provider from "../models/Provider.js";
import Customer from "../models/Customer.js";
import User from "../models/User.js";

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "30d",
  });
};

// Register Customer
export const registerCustomer = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Validation
    if (!name || !email || !password || !phone || !address) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required: name, email, password, phone, address",
      });
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: "Customer with this email already exists",
      });
    }

    // Create customer
    const customer = new Customer({
      name,
      email,
      password,
      phone,
      address,
      role: "customer",
    });

    await customer.save();

    // Generate token
    const token = generateToken(customer._id, "customer");

    // Remove password from response
    const customerData = customer.toObject();
    delete customerData.password;

    res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      data: {
        customer: customerData,
        token,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || "Error registering customer",
    });
  }
};

// Register Provider
export const registerProvider = async (req, res) => {
  try {
    const { name, email, password, phone, address, experience_years, skills } =
      req.body;

    // Validation
    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !address ||
      !experience_years ||
      !skills
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required: name, email, password, phone, address, experience_years, skills",
      });
    }

    // Check if provider already exists
    const existingProvider = await Provider.findOne({ email });
    if (existingProvider) {
      return res.status(400).json({
        success: false,
        message: "Provider with this email already exists",
      });
    }

    // Create provider (pending approval - default is false)
    const provider = new Provider({
      name,
      email,
      password,
      phone,
      address,
      experience_years,
      skills,
      role: "provider",
      isApproved: false, // Explicitly set to false - requires admin approval
    });

    await provider.save();

    // Remove password from response
    const providerData = provider.toObject();
    delete providerData.password;

    res.status(201).json({
      success: true,
      message:
        "Provider registered successfully. Your account is pending admin approval. You will be able to log in and access provider features once approved.",
      data: {
        provider: providerData,
        isApproved: false,
        approvalMessage:
          "Your account requires admin approval before you can access provider features.",
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || "Error registering provider",
    });
  }
};

// Register Admin (usually done manually or by another admin)
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: name, email, password",
      });
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email, role: "admin" });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email already exists",
      });
    }

    // Create admin
    const admin = new User({
      name,
      email,
      password,
      role: "admin",
    });

    await admin.save();

    // Generate token
    const token = generateToken(admin._id, "admin");

    // Remove password from response
    const adminData = admin.toObject();
    delete adminData.password;

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: {
        admin: adminData,
        token,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || "Error registering admin",
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validation
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and role are required",
      });
    }

    let user = null;

    // Find user based on role
    if (role === "customer") {
      user = await Customer.findOne({ email }).select("+password");
    } else if (role === "provider") {
      user = await Provider.findOne({ email }).select("+password");
    } else if (role === "admin") {
      user = await User.findOne({ email, role: "admin" }).select("+password");
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password first
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // For providers, check approval status AFTER password verification
    if (role === "provider" && !user.isApproved) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. Your provider account is pending admin approval. Please contact an administrator or wait for approval.",
        isApproved: false,
      });
    }

    // Generate token
    const token = generateToken(user._id, role);

    // Remove password from response
    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: userData,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error during login",
    });
  }
};
