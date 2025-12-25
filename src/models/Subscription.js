import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      refPath: "userType",
    },
    userType: {
      type: String,
      required: true,
      enum: ["Provider", "Customer"],
    },
    plan_name: {
      type: String,
      required: [true, "Plan name is required"],
      enum: ["Free", "Standard", "Premium", "Business", "Individual"],
      default: "Free",
      trim: true,
    },
    start_date: {
      type: Date,
      default: Date.now,
    },
    end_date: {
      type: Date,
      required: [true, "End date is required"],
    },
    renewal_date: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Active", "Expired", "Cancelled"],
      default: "Active",
    },
    amount: {
      type: Number,
      required: [true, "Subscription amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    stripePaymentIntentId: {
      type: String,
      default: null,
    },
    stripeCheckoutSessionId: {
      type: String,
      default: null,
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// 🔁 Automatically mark expired subscriptions
subscriptionSchema.pre("save", function (next) {
  if (this.end_date < new Date() && this.status === "Active") {
    this.status = "Active";
  }
  next();
});

// ⚡ Index for faster lookups by user
subscriptionSchema.index({ userId: 1 });

export default mongoose.model("Subscription", subscriptionSchema);
