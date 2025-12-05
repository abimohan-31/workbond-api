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
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Customer,
      required: [true, "Customer ID is required"],
      index: true,
    },
    applications: [
      {
        providerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Provider,
          required: true,
        },
        status: {
          type: String,
          enum: ["applied", "approved", "rejected"],
          default: "applied",
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    jobStatus: {
      type: String,
      enum: ["open", "in_progress", "completed", "cancelled"],
      default: "open",
    },
    assignedProviderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Provider,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
jobPostSchema.index({ service_id: 1 });
jobPostSchema.index({ customerId: 1 });
jobPostSchema.index({ "applications.providerId": 1 });

export default mongoose.model("JobPost", jobPostSchema);
