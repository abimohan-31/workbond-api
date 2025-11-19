import mongoose from "mongoose";
import Service from "./Service.js";

const priceListSchema = new mongoose.Schema(
  {
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Service,
      required: [true, "Service ID is required"],
      index: true,
    },
    price_type: {
      type: String,
      enum: ["fixed", "per_unit", "range"],
      required: [true, "Price type is required"],
    },
    // For fixed price
    fixed_price: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },
    // For per unit price (e.g., per square foot)
    unit_price: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },
    unit: {
      type: String,
      enum: ["hour", "day", "project", "item", "square_feet", "square_meter"],
      default: "hour",
    },
    // For price range
    min_price: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },
    max_price: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
priceListSchema.index({ service_id: 1, isActive: 1 });
priceListSchema.index({ price_type: 1 });

// Validation: Ensure at least one price field is set based on price_type
priceListSchema.pre("save", function (next) {
  if (this.price_type === "fixed" && !this.fixed_price) {
    return next(new Error("Fixed price is required for fixed price type"));
  }
  if (this.price_type === "per_unit" && !this.unit_price) {
    return next(new Error("Unit price is required for per_unit price type"));
  }
  if (this.price_type === "range") {
    if (!this.min_price || !this.max_price) {
      return next(
        new Error("Min and max prices are required for range price type")
      );
    }
    if (this.min_price > this.max_price) {
      return next(
        new Error("Min price cannot be greater than max price")
      );
    }
  }
  next();
});

export default mongoose.model("PriceList", priceListSchema);

