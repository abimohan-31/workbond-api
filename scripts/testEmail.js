import { sendApprovalEmail, sendRejectionEmail } from "../src/utils/emailService.js";
import dotenv from "dotenv";

dotenv.config();

const testEmail = async () => {
  console.log("Testing Email Service...");
  console.log("Using User:", process.env.SMTP_USER ? "Provided" : "Missing");
  console.log("SMTP Host:", process.env.SMTP_HOST);

  try {
    console.log("Sending Approval Email...");
    await sendApprovalEmail(process.env.SMTP_USER, "Test User");
    console.log("Approval Email Sent (Check Inbox)");

    console.log("Sending Rejection Email...");
    await sendRejectionEmail(process.env.SMTP_USER, "Test User", "Testing rejection reason");
    console.log("Rejection Email Sent (Check Inbox)");
  } catch (error) {
    console.error("Test Failed:", error);
  }
};

testEmail();
