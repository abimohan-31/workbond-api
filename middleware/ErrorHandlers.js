// Custom error handling middleware
export const defaultError = (error, req, res, next) => {
  res.status(500).json({ message: "Something went wrong!" });
};

export const notFound = (req, res, next) => {
  const error = new Error("Not Found!");
  error.status = 404;
  next(error);
};
