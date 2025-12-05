import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const providerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    experience_years: {
      type: Number,
      required: [true, "Experience years are required"],
      min: [1, "Minimum 1 year of experience is required"],
    },
    skills: {
      type: [String],
      required: [true, "At least one skill is required"],
    },
    availability_status: {
      type: String,
      enum: ["Available", "Unavailable"],
      default: "Available",
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    profileImage: {
      type: String,
      default: null,
    },
    workImages: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          default: "",
        },
        beforeImage: {
          type: String,
          required: true,
        },
        afterImage: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          default: "",
        },
        // Link work entry to a completed job (optional)
        // This allows providers to associate their work with specific completed jobs
        jobPostId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "JobPost",
          default: null,
        },
        // Track when the job was completed (optional)
        // Helps providers remember when they finished the work
        completedAt: {
          type: Date,
          default: null,
        },
        // Customer feedback or notes about the work (optional)
        // Allows providers to add context about customer satisfaction
        customerFeedback: {
          type: String,
          default: "",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    isActive: {
      type: Boolean,
      default: false,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
providerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
providerSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("Provider", providerSchema);
