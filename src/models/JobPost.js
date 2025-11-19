import mongoose from "mongoose";
import Service from "./Service.js";
import Customer from "./Customer.js";
import Provider from "./Provider.js";

const jobPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
      // Examples: "2 weeks", "1 month", "3 days", "Contract-based"
    },
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Service,
      required: [true, "Service is required"],
      index: true,
    },
    location: {
      type: String,
      trim: true,
      // Optional field
    },
    posted_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Customer,
      required: [true, "Customer ID is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    applied_providers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Provider,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
jobPostSchema.index({ service_id: 1, status: 1 });
jobPostSchema.index({ posted_by: 1 });
jobPostSchema.index({ status: 1 });

export default mongoose.model("JobPost", jobPostSchema);
