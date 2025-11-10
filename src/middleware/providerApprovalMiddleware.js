// Provider approval middleware - Checks if provider is approved
export const checkProviderApproval = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (req.user.role !== "provider") {
    return res.status(403).json({
      success: false,
      message: "This route is only accessible to providers.",
    });
  }

  if (!req.user.isApproved) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Your provider account is pending approval.",
    });
  }

  next();
};

