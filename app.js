import express from "express";
import connectDB from "./src/config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
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
import workPostsRouter from "./src/routes/workPostsRoutes.js";
import paymentsRouter from "./src/routes/paymentsRoutes.js";

// Initialize express
const app = express();
// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://work-bond-app.vercel.app",
      "https://workbond-git-main.vercel.app",
      /\.vercel\.app$/, // Allow all Vercel preview deployments
    ],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// IMPORTANT: paymentsRouter must come BEFORE express.json() 
// because the Stripe webhook needs the raw body.
app.use("/api/payments", paymentsRouter);

app.use(express.json());
app.use(cookieParser()); // Parse cookies from requests

// Ensure database connection is ready for serverless
if (process.env.VERCEL) {
  connectDB().catch((err) => console.error("Database connection error:", err));
}

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
app.use("/api/customers", customersRouter);
app.use("/api/providers", providersRouter);
app.use("/api/subscriptions", subscriptionsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/services", servicesRouter);
app.use("/api/price-list", priceListRouter);
app.use("/api/jobposts", jobPostsRouter);
app.use("/api/workposts", workPostsRouter);
// app.use("/api/payments", paymentsRouter); // Moved before express.json() for webhook support


// Page not found
app.use(notFound);

// Error Handlers
app.use(defaultError);

// Connect Server
// Connect Server
// Export app for Vercel
export default app;

// Only start the server if we're not running on Vercel
if (!process.env.VERCEL) {
  const startServer = async () => {
    try {
      await connectDB();
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
    }
  };

  startServer();
} else {
  // On Vercel, we can rely on lazy connection or pre-connect
  // Awaiting here might help with initial spin-up performance
  connectDB().catch((err) => console.error("Database connection error:", err));
}

