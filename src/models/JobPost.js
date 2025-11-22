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
