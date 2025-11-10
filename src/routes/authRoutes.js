import express from "express";
import {
  registerCustomer,
  registerProvider,
  registerAdmin,
  login,
} from "../controllers/AuthController.js";

const authRouter = express.Router();

// Public routes
authRouter.post("/register/customer", registerCustomer);
authRouter.post("/register/provider", registerProvider);
authRouter.post("/register/admin", registerAdmin);
authRouter.post("/login", login);

export default authRouter;

