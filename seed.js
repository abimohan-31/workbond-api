import mongoose from "mongoose";
import dotenv from "dotenv";

// Import models
import User from "./src/models/Auth.js";
import Service from "./src/models/Service.js";
import PriceList from "./src/models/PriceList.js";

// Load environment variables
dotenv.config();

// Check if running in development
if (process.env.NODE_ENV === "production") {
  console.error("Seeding is not allowed in production environment!");
  process.exit(1);
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Clear all collections
const clearCollections = async () => {
  try {
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Service.deleteMany({});
    await PriceList.deleteMany({});
    console.log("Collections cleared successfully!");
  } catch (error) {
    console.error("Error clearing collections:", error);
    throw error;
  }
};

// Seed Admin
const seedAdmin = async () => {
  try {
    console.log("Seeding Admin...");

    const admin = new User({
      name: "Admin User",
      email: "admin@gmail.com",
      password: "admin0004", // Will be hashed by pre-save hook
      role: "admin",
    });

    await admin.save();
    console.log(`Admin created: ${admin.email} (password: admin0004)`);
    return admin;
  } catch (error) {
    console.error("Error seeding admin:", error);
    throw error;
  }
};

// Seed Services
const seedServices = async () => {
  try {
    console.log("Seeding Services...");

    const services = [
      {
        name: "painting",
        description: "Professional painting services for homes and offices",
        category: "Painting",
        base_price: 50,
        unit: "hour",
        isActive: true,
      },
      {
        name: "gardening",
        description: "Expert gardening and landscaping services",
        category: "Gardening",
        base_price: 40,
        unit: "hour",
        isActive: true,
      },
      {
        name: "cleaning",
        description: "Thorough cleaning services for residential and commercial spaces",
        category: "Cleaning",
        base_price: 30,
        unit: "hour",
        isActive: true,
      },
      {
        name: "plumbing",
        description: "Professional plumbing repairs and installations",
        category: "Plumbing",
        base_price: 60,
        unit: "hour",
        isActive: true,
      },
      {
        name: "electrical",
        description: "Licensed electrical work and repairs",
        category: "Electrical",
        base_price: 70,
        unit: "hour",
        isActive: true,
      },
    ];

    const createdServices = await Service.insertMany(services);
    console.log(`${createdServices.length} services created`);
    return createdServices;
  } catch (error) {
    console.error("Error seeding services:", error);
    throw error;
  }
};

// Seed Price Lists
const seedPriceLists = async (services) => {
  try {
    console.log("Seeding Price Lists...");

    const paintingService = services.find((s) => s.name === "painting");
    const gardeningService = services.find((s) => s.name === "gardening");
    const cleaningService = services.find((s) => s.name === "cleaning");
    const plumbingService = services.find((s) => s.name === "plumbing");
    const electricalService = services.find((s) => s.name === "electrical");

    const priceLists = [];

    // Paint: price per square foot
    if (paintingService) {
      priceLists.push({
        service_id: paintingService._id,
        price_type: "per_unit",
        unit_price: 2.5, // $2.50 per square foot
        unit: "square_feet",
        description: "Price per square foot for interior painting",
        isActive: true,
      });
      priceLists.push({
        service_id: paintingService._id,
        price_type: "per_unit",
        unit_price: 3.0, // $3.00 per square foot
        unit: "square_feet",
        description: "Price per square foot for exterior painting",
        isActive: true,
      });
    }

    // Gardening: average price range
    if (gardeningService) {
      priceLists.push({
        service_id: gardeningService._id,
        price_type: "range",
        min_price: 50,
        max_price: 150,
        description: "Average price range for basic gardening services per visit",
        isActive: true,
      });
      priceLists.push({
        service_id: gardeningService._id,
        price_type: "range",
        min_price: 200,
        max_price: 500,
        description: "Price range for full landscaping projects",
        isActive: true,
      });
    }

    // Cleaning: fixed price
    if (cleaningService) {
      priceLists.push({
        service_id: cleaningService._id,
        price_type: "fixed",
        fixed_price: 100,
        description: "Standard cleaning service for small apartments (1-2 bedrooms)",
        isActive: true,
      });
      priceLists.push({
        service_id: cleaningService._id,
        price_type: "fixed",
        fixed_price: 150,
        description: "Deep cleaning service for medium homes (3-4 bedrooms)",
        isActive: true,
      });
    }

    // Plumbing: per unit (per hour)
    if (plumbingService) {
      priceLists.push({
        service_id: plumbingService._id,
        price_type: "per_unit",
        unit_price: 80,
        unit: "hour",
        description: "Standard plumbing service rate per hour",
        isActive: true,
      });
    }

    // Electrical: fixed price for common jobs
    if (electricalService) {
      priceLists.push({
        service_id: electricalService._id,
        price_type: "fixed",
        fixed_price: 120,
        description: "Fixed price for standard electrical outlet installation",
        isActive: true,
      });
      priceLists.push({
        service_id: electricalService._id,
        price_type: "per_unit",
        unit_price: 90,
        unit: "hour",
        description: "Electrical repair service rate per hour",
        isActive: true,
      });
    }

    const createdPriceLists = await PriceList.insertMany(priceLists);
    console.log(`${createdPriceLists.length} price lists created`);
    return createdPriceLists;
  } catch (error) {
    console.error("Error seeding price lists:", error);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log(" Starting database seeding process...");
    console.log("Environment: ", process.env.NODE_ENV || "development");

    // Connect to database
    await connectDB();

    // Clear existing data
    await clearCollections();

    // Seed data
    const admin = await seedAdmin();
    const services = await seedServices();
    const priceLists = await seedPriceLists(services);

    // Summary
    console.log("" + "=".repeat(50));
    console.log(" Seeding Summary:");
    console.log("=".repeat(50));
    console.log(`Admin: 1`);
    console.log(`Services: ${services.length}`);
    console.log(`Price Lists: ${priceLists.length}`);
    console.log("=".repeat(50));
    console.log(" Database seeded successfully!");
    console.log(" Test Credentials:");
    console.log(" Admin : admin@gmail.com /admin0004");
    console.log("");
    console.log(" Example Price Lists:");
    console.log(" - Painting: $2.50-$3.00 per square foot");
    console.log(" - Gardening: $50-$150 (basic) or $200-$500 (landscaping)");
    console.log(" - Cleaning: $100-$150 fixed price");
    console.log("");

    // Close connection
    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run seeding
seedDatabase();
