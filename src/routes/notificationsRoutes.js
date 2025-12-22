import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/notificationsController.js";
import { verifyToken as protect } from "../middleware/authMiddleware.js"; // Assuming auth middleware exists

const router = express.Router();

router.use(protect); // Protect all routes

router.get("/", getNotifications);
router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);

export default router;
