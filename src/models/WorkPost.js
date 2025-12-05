import mongoose from "mongoose";
import Provider from "./Provider.js";
import JobPost from "./JobPost.js";
import Service from "./Service.js";
import Customer from "./Customer.js";

// WorkPost model represents completed works posted by service providers
// This is separate from JobPost which represents job postings by customers
const workPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Work title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    beforeImage: {
      type: String,
      required: [true, "Before image is required"],
    },
    afterImage: {
      type: String,
      required: [true, "After image is required"],
    },
    category: {
      type: String,
      default: "",
      trim: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Provider,
      required: [true, "Provider ID is required"],
      index: true,
    },
    jobPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: JobPost,
      default: null,
      index: true,
    },
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Service,
      default: null,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Customer,
      default: null,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
    customerFeedback: {
      type: String,
      default: "",
      trim: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
workPostSchema.index({ providerId: 1 });
workPostSchema.index({ jobPostId: 1 });
workPostSchema.index({ category: 1 });
workPostSchema.index({ createdAt: -1 });
workPostSchema.index({ isPublic: 1 });

export default mongoose.model("WorkPost", workPostSchema);
