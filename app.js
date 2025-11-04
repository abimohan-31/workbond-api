import express from "express";
import connectDB from "./config/db.js";
import userRouter from "./routes/AuthRoutes.js";
import providerRouter from "./routes/ProviderRoutes.js";
import serviceRouter from "./routes/ServiceRoutes.js";
import bookingRouter from "./routes/BookingRoutes.js";
import reviewRouter from "./routes/ReviewRoutes.js";
import paymentRouter from "./routes/PaymentRoutes.js";

// Initialized express
const app = express();
app.use(express.json());

// Test if the server is working or not.
app.get("/", (req, res) => {
  res.send("Welcome to Mini pos API");
});

//Connect MongoDB
connectDB();

//Routes
app.use("/api/users/", userRouter);
app.use("/api/providers/", providerRouter);
app.use("/api/services/", serviceRouter);
app.use("/api/bookings/", bookingRouter);
app.use("/api/reviews/", reviewRouter);
app.use("/api/payments/", paymentRouter);

//Connect Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
