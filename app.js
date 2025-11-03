import express from "express";
import connectDB from "./config/db.js";
import userRouter from "./routes/AuthRoutes.js";

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
app.use("/c2c/users/", userRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
