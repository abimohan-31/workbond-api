import express from "express";
import connectDB from "./src/config/db.js";
import cors from "cors";
import { defaultError, notFound } from "./src/middleware/ErrorHandlers.js";

// Import route groups
import customersRouter from "./src/routes/customersRoutes.js";
import providersRouter from "./src/routes/providersRoutes.js";
import subscriptionsRouter from "./src/routes/subscriptionsRoutes.js";
import reviewsRouter from "./src/routes/reviewsRoutes.js";
import servicesRouter from "./src/routes/servicesRoutes.js";
import priceListRouter from "./src/routes/priceListRoutes.js";
import usersRouter from "./src/routes/authRoutes.js";
import jobPostsRouter from "./src/routes/jobPostsRoutes.js";
import adminRouter from "./src/routes/adminRoutes.js";

// Initialize express
const app = express();
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true, // Allow cookies/auth headers
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  })
);

// Test if the server is working or not
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Work Bond",
  });
});

// Connect MongoDB
// Connect MongoDB - Moved to startServer

// API Routes
app.use("/api/users", usersRouter);
app.use("/api/admins", adminRouter);
app.use("/api/customers", customersRouter);
app.use("/api/providers", providersRouter);
app.use("/api/subscriptions", subscriptionsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/services", servicesRouter);
app.use("/api/price-list", priceListRouter);
app.use("/api/job-posts", jobPostsRouter);

// Page not found
app.use(notFound);

// Error Handlers
app.use(defaultError);

// Connect Server
// Connect Server
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
