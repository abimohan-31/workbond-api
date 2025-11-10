import jwt from "jsonwebtoken";
import Provider from "../models/Provider.js";
import Customer from "../models/Customer.js";
import User from "../models/User.js";

// Authentication middleware - Verifies JWT tokens
export const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");

    // Find user based on role
    let user = null;
    if (decoded.role === "provider") {
      user = await Provider.findById(decoded.id);
    } else if (decoded.role === "customer") {
      user = await Customer.findById(decoded.id);
    } else if (decoded.role === "admin") {
      user = await User.findById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. User not found.",
      });
    }

    // Attach user details to request
    req.user = {
      id: user._id.toString(),
      role: decoded.role,
      email: user.email,
      name: user.name,
    };

    // For providers, also attach approval status
    if (decoded.role === "provider") {
      req.user.isApproved = user.isApproved;
    }

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Authentication error.",
    });
  }
};

