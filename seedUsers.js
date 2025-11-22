import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Import models from src
import Provider from "./src/models/Provider.js";
import Customer from "./src/models/Customer.js";
import Service from "./src/models/Service.js";
import PriceList from "./src/models/PriceList.js";
import Review from "./src/models/Review.js";
import JobPost from "./src/models/JobPost.js";
import Subscription from "./src/models/Subscription.js";

dotenv.config();

// --------------------
// 2. Provider & Customer Data
// --------------------
const providers = [
  {
    name: "Tharindu Weerasinghe",
    email: "tharindu.weerasinghe@example.com",
    phone: "0761234567",
    address: "Colombo",
    experience_years: 3,
    skills: ["Plumbing", "Maintenance"],
    availability_status: "Available",
    rating: 4,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Sajini Perera",
    email: "sajini.perera@example.com",
    phone: "0719876543",
    address: "Gampaha",
    experience_years: 2,
    skills: ["Cleaning"],
    availability_status: "Unavailable",
    rating: 5,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Dulitha Madushanka",
    email: "dulitha.madushanka@example.com",
    phone: "0758765432",
    address: "Kandy",
    experience_years: 4,
    skills: ["Electrician", "Repairing"],
    availability_status: "Available",
    rating: 3,
    role: "provider",
    isApproved: false,
  },
  {
    name: "Nadeesha Fernando",
    email: "nadeesha.fernando@example.com",
    phone: "0773456789",
    address: "Negombo",
    experience_years: 3,
    skills: ["Painting"],
    availability_status: "Available",
    rating: 4,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Ishara Jayawardena",
    email: "ishara.jayawardena@example.com",
    phone: "0742345678",
    address: "Matara",
    experience_years: 5,
    skills: ["Gardening", "Cleaning"],
    availability_status: "Unavailable",
    rating: 5,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Ravindu Silva",
    email: "ravindu.silva@example.com",
    phone: "0709988776",
    address: "Kurunegala",
    experience_years: 3,
    skills: ["Electrician"],
    availability_status: "Available",
    rating: 4,
    role: "provider",
    isApproved: false,
  },
  {
    name: "Gayani Dias",
    email: "gayani.dias@example.com",
    phone: "0768889991",
    address: "Ratnapura",
    experience_years: 2,
    skills: ["Cleaning"],
    availability_status: "Available",
    rating: 3,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Kaveeshan Ratnayake",
    email: "kaveeshan.ratnayake@example.com",
    phone: "0712233445",
    address: "Jaffna",
    experience_years: 4,
    skills: ["Plumbing", "Repairing"],
    availability_status: "Unavailable",
    rating: 4,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Sathsara Gunasekara",
    email: "sathsara.gunasekara@example.com",
    phone: "0751122334",
    address: "Anuradhapura",
    experience_years: 3,
    skills: ["Painting"],
    availability_status: "Available",
    rating: 5,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Harshi Aluwihare",
    email: "harshi.aluwihare@example.com",
    phone: "0776655443",
    address: "Kegalle",
    experience_years: 1,
    skills: ["Cleaning"],
    availability_status: "Unavailable",
    rating: 3,
    role: "provider",
    isApproved: false,
  },
  {
    name: "Sanjula Karunaratne",
    email: "sanjula.karunaratne@example.com",
    phone: "0702345678",
    address: "Colombo",
    experience_years: 2,
    skills: ["Electrician"],
    availability_status: "Available",
    rating: 4,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Nimashi Ranathunga",
    email: "nimashi.ranathunga@example.com",
    phone: "0763456789",
    address: "Galle",
    experience_years: 3,
    skills: ["Cleaning", "Gardening"],
    availability_status: "Available",
    rating: 5,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Kalpa Abeysekara",
    email: "kalpa.abeysekara@example.com",
    phone: "0715566778",
    address: "Matale",
    experience_years: 4,
    skills: ["Plumbing"],
    availability_status: "Unavailable",
    rating: 4,
    role: "provider",
    isApproved: false,
  },
  {
    name: "Vindya Udayanga",
    email: "vindya.udayanga@example.com",
    phone: "0754433221",
    address: "Trincomalee",
    experience_years: 2,
    skills: ["Painting"],
    availability_status: "Available",
    rating: 3,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Malith Peris",
    email: "malith.peris@example.com",
    phone: "0771122443",
    address: "Badulla",
    experience_years: 5,
    skills: ["Electrician"],
    availability_status: "Unavailable",
    rating: 5,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Yasas Muthumala",
    email: "yasas.muthumala@example.com",
    phone: "0746677889",
    address: "Kurunegala",
    experience_years: 3,
    skills: ["Plumbing"],
    availability_status: "Available",
    rating: 4,
    role: "provider",
    isApproved: false,
  },
  {
    name: "Chathuni Ekanayake",
    email: "chathuni.ekanayake@example.com",
    phone: "0709988771",
    address: "Hambantota",
    experience_years: 1,
    skills: ["Cleaning"],
    availability_status: "Available",
    rating: 3,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Sachintha Prabath",
    email: "sachintha.prabath@example.com",
    phone: "0765544332",
    address: "Nuwara Eliya",
    experience_years: 4,
    skills: ["Painter", "Repairing"],
    availability_status: "Unavailable",
    rating: 4,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Nirasha Herath",
    email: "nirasha.herath@example.com",
    phone: "0754455667",
    address: "Kandy",
    experience_years: 3,
    skills: ["Electrician"],
    availability_status: "Available",
    rating: 5,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Ayesh Fonseka",
    email: "ayesh.fonseka@example.com",
    phone: "0716677885",
    address: "Colombo",
    experience_years: 2,
    skills: ["Gardening"],
    availability_status: "Unavailable",
    rating: 3,
    role: "provider",
    isApproved: false,
  },
  {
    name: "Thilini Samarasekara",
    email: "thilini.samarasekara@example.com",
    phone: "0702233441",
    address: "Gampaha",
    experience_years: 3,
    skills: ["Painting"],
    availability_status: "Available",
    rating: 4,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Chamod Lakshan",
    email: "chamod.lakshan@example.com",
    phone: "0768899001",
    address: "Colombo",
    experience_years: 2,
    skills: ["Electrician"],
    availability_status: "Unavailable",
    rating: 5,
    role: "provider",
    isApproved: false,
  },
  {
    name: "Pavani Senanayake",
    email: "pavani.senanayake@example.com",
    phone: "0753322114",
    address: "Kegalle",
    experience_years: 4,
    skills: ["Cleaning"],
    availability_status: "Available",
    rating: 4,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Ramesh Priyadarshana",
    email: "ramesh.priyadarshana@example.com",
    phone: "0775566443",
    address: "Anuradhapura",
    experience_years: 5,
    skills: ["Plumbing"],
    availability_status: "Unavailable",
    rating: 5,
    role: "provider",
    isApproved: true,
  },
  {
    name: "Imesha Wijeratne",
    email: "imesha.wijeratne@example.com",
    phone: "0749988774",
    address: "Kurunegala",
    experience_years: 3,
    skills: ["Painting"],
    availability_status: "Available",
    rating: 4,
    role: "provider",
    isApproved: false,
  },
];

const customers = [
  {
    name: "Tharindu Weerasinghe",
    email: "tharindu.customer1@example.com",
    phone: "0761111111",
    address: "Colombo",
    role: "customer",
    isActive: true,
  },
  {
    name: "Sajini Perera",
    email: "sajini.customer2@example.com",
    phone: "0762222222",
    address: "Gampaha",
    role: "customer",
    isActive: true,
  },
  {
    name: "Dilshan Jayawardena",
    email: "dilshan.customer3@example.com",
    phone: "0763333333",
    address: "Kandy",
    role: "customer",
    isActive: true,
  },
  {
    name: "Nadeesha Fernando",
    email: "nadeesha.customer4@example.com",
    phone: "0764444444",
    address: "Negombo",
    role: "customer",
    isActive: true,
  },
  {
    name: "Ishara Madushani",
    email: "ishara.customer5@example.com",
    phone: "0765555555",
    address: "Matara",
    role: "customer",
    isActive: true,
  },
  {
    name: "Ravindu Silva",
    email: "ravindu.customer6@example.com",
    phone: "0766666666",
    address: "Kurunegala",
    role: "customer",
    isActive: true,
  },
  {
    name: "Gayani Dias",
    email: "gayani.customer7@example.com",
    phone: "0767777777",
    address: "Ratnapura",
    role: "customer",
    isActive: true,
  },
  {
    name: "Kaveesha Ratnayake",
    email: "kaveesha.customer8@example.com",
    phone: "0768888888",
    address: "Jaffna",
    role: "customer",
    isActive: true,
  },
  {
    name: "Sathsara Gunasekara",
    email: "sathsara.customer9@example.com",
    phone: "0769999999",
    address: "Anuradhapura",
    role: "customer",
    isActive: true,
  },
  {
    name: "Harshi Aluwihare",
    email: "harshi.customer10@example.com",
    phone: "0711111111",
    address: "Kegalle",
    role: "customer",
    isActive: true,
  },
  {
    name: "Sanjula Karunaratne",
    email: "sanjula.customer11@example.com",
    phone: "0712222222",
    address: "Colombo",
    role: "customer",
    isActive: true,
  },
  {
    name: "Nimashi Ranathunga",
    email: "nimashi.customer12@example.com",
    phone: "0713333333",
    address: "Galle",
    role: "customer",
    isActive: true,
  },
  {
    name: "Kalpa Abeysekara",
    email: "kalpa.customer13@example.com",
    phone: "0714444444",
    address: "Matale",
    role: "customer",
    isActive: true,
  },
  {
    name: "Vindya Udayanga",
    email: "vindya.customer14@example.com",
    phone: "0715555555",
    address: "Trincomalee",
    role: "customer",
    isActive: true,
  },
  {
    name: "Malith Peris",
    email: "malith.customer15@example.com",
    phone: "0716666666",
    address: "Badulla",
    role: "customer",
    isActive: true,
  },
  {
    name: "Yasas Muthumala",
    email: "yasas.customer16@example.com",
    phone: "0717777777",
    address: "Kurunegala",
    role: "customer",
    isActive: true,
  },
  {
    name: "Chathuni Ekanayake",
    email: "chathuni.customer17@example.com",
    phone: "0718888888",
    address: "Hambantota",
    role: "customer",
    isActive: true,
  },
  {
    name: "Sachintha Prabath",
    email: "sachintha.customer18@example.com",
    phone: "0719999999",
    address: "Nuwara Eliya",
    role: "customer",
    isActive: true,
  },
  {
    name: "Nirasha Herath",
    email: "nirasha.customer19@example.com",
    phone: "0751111111",
    address: "Kandy",
    role: "customer",
    isActive: true,
  },
  {
    name: "Ayesh Fonseka",
    email: "ayesh.customer20@example.com",
    phone: "0752222222",
    address: "Colombo",
    role: "customer",
    isActive: true,
  },
  {
    name: "Thilini Samarasekara",
    email: "thilini.customer21@example.com",
    phone: "0753333333",
    address: "Gampaha",
    role: "customer",
    isActive: true,
  },
  {
    name: "Chamod Lakshan",
    email: "chamod.customer22@example.com",
    phone: "0754444444",
    address: "Colombo",
    role: "customer",
    isActive: true,
  },
  {
    name: "Pavani Senanayake",
    email: "pavani.customer23@example.com",
    phone: "0755555555",
    address: "Kegalle",
    role: "customer",
    isActive: true,
  },
  {
    name: "Ramesh Priyadarshana",
    email: "ramesh.customer24@example.com",
    phone: "0756666666",
    address: "Anuradhapura",
    role: "customer",
    isActive: true,
  },
  {
    name: "Imesha Wijeratne",
    email: "imesha.customer25@example.com",
    phone: "0757777777",
    address: "Kurunegala",
    role: "customer",
    isActive: true,
  },
];

// Seed Services
const seedServices = async () => {
  try {
    console.log("Seeding Services...");

    const services = [
      // Painting Services
      {
        name: "interior painting",
        description:
          "Professional interior painting services for homes and offices",
        category: "Painting",
        base_price: 5000,
        unit: "hour",
        isActive: true,
      },
      {
        name: "exterior painting",
        description: "Expert exterior painting and weatherproofing services",
        category: "Painting",
        base_price: 6000,
        unit: "hour",
        isActive: true,
      },
      {
        name: "wall painting",
        description: "Wall painting and touch-up services",
        category: "Painting",
        base_price: 4500,
        unit: "hour",
        isActive: true,
      },

      // Gardening Services
      {
        name: "garden maintenance",
        description: "Regular garden maintenance and lawn care services",
        category: "Gardening",
        base_price: 4000,
        unit: "hour",
        isActive: true,
      },
      {
        name: "landscaping",
        description: "Complete landscaping and garden design services",
        category: "Gardening",
        base_price: 8000,
        unit: "hour",
        isActive: true,
      },
      {
        name: "tree trimming",
        description: "Professional tree trimming and pruning services",
        category: "Gardening",
        base_price: 5000,
        unit: "hour",
        isActive: true,
      },

      // Cleaning Services
      {
        name: "house cleaning",
        description:
          "Comprehensive house cleaning services for residential spaces",
        category: "Cleaning",
        base_price: 3000,
        unit: "hour",
        isActive: true,
      },
      {
        name: "deep cleaning",
        description: "Thorough deep cleaning services for homes and offices",
        category: "Cleaning",
        base_price: 4000,
        unit: "hour",
        isActive: true,
      },
      {
        name: "carpet cleaning",
        description: "Professional carpet and upholstery cleaning services",
        category: "Cleaning",
        base_price: 3500,
        unit: "hour",
        isActive: true,
      },
      {
        name: "window cleaning",
        description:
          "Window and glass cleaning services for residential and commercial",
        category: "Cleaning",
        base_price: 2500,
        unit: "hour",
        isActive: true,
      },

      // Plumbing Services
      {
        name: "plumbing repair",
        description: "Professional plumbing repairs and maintenance",
        category: "Plumbing",
        base_price: 6000,
        unit: "hour",
        isActive: true,
      },
      {
        name: "pipe installation",
        description: "New pipe installation and replacement services",
        category: "Plumbing",
        base_price: 7000,
        unit: "hour",
        isActive: true,
      },
      {
        name: "leak fixing",
        description: "Water leak detection and fixing services",
        category: "Plumbing",
        base_price: 5500,
        unit: "hour",
        isActive: true,
      },

      // Electrical Services
      {
        name: "electrical repair",
        description: "Licensed electrical repairs and troubleshooting",
        category: "Electrical",
        base_price: 7000,
        unit: "hour",
        isActive: true,
      },
      {
        name: "wiring installation",
        description: "New electrical wiring and installation services",
        category: "Electrical",
        base_price: 8000,
        unit: "hour",
        isActive: true,
      },
      {
        name: "electrical maintenance",
        description: "Regular electrical maintenance and safety checks",
        category: "Electrical",
        base_price: 6500,
        unit: "hour",
        isActive: true,
      },

      // Carpentry Services
      {
        name: "furniture repair",
        description: "Professional furniture repair and restoration services",
        category: "Carpentry",
        base_price: 5000,
        unit: "hour",
        isActive: true,
      },
      {
        name: "cabinet installation",
        description: "Custom cabinet and shelf installation services",
        category: "Carpentry",
        base_price: 6000,
        unit: "hour",
        isActive: true,
      },

      // Handyman Services
      {
        name: "general handyman",
        description: "General handyman services for various home repairs",
        category: "Handyman",
        base_price: 4000,
        unit: "hour",
        isActive: true,
      },
      {
        name: "appliance repair",
        description: "Home appliance repair and maintenance services",
        category: "Handyman",
        base_price: 5000,
        unit: "hour",
        isActive: true,
      },

      // Moving Services
      {
        name: "house moving",
        description: "Professional house moving and relocation services",
        category: "Moving",
        base_price: 10000,
        unit: "day",
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

    const priceLists = [];

    // Helper function to find service by name
    const findService = (name) => services.find((s) => s.name === name);

    // Painting Services
    const interiorPainting = findService("interior painting");
    if (interiorPainting) {
      priceLists.push({
        service_id: interiorPainting._id,
        price_type: "per_unit",
        unit_price: 250,
        unit: "square_feet",
        description: "Price per square foot for interior painting (LKR)",
        isActive: true,
      });
    }

    const exteriorPainting = findService("exterior painting");
    if (exteriorPainting) {
      priceLists.push({
        service_id: exteriorPainting._id,
        price_type: "per_unit",
        unit_price: 300,
        unit: "square_feet",
        description: "Price per square foot for exterior painting (LKR)",
        isActive: true,
      });
    }

    const wallPainting = findService("wall painting");
    if (wallPainting) {
      priceLists.push({
        service_id: wallPainting._id,
        price_type: "per_unit",
        unit_price: 200,
        unit: "square_feet",
        description: "Price per square foot for wall painting (LKR)",
        isActive: true,
      });
    }

    // Gardening Services
    const gardenMaintenance = findService("garden maintenance");
    if (gardenMaintenance) {
      priceLists.push({
        service_id: gardenMaintenance._id,
        price_type: "range",
        min_price: 5000,
        max_price: 15000,
        description: "Price range for garden maintenance per visit (LKR)",
        isActive: true,
      });
    }

    const landscaping = findService("landscaping");
    if (landscaping) {
      priceLists.push({
        service_id: landscaping._id,
        price_type: "range",
        min_price: 20000,
        max_price: 100000,
        description: "Price range for complete landscaping projects (LKR)",
        isActive: true,
      });
    }

    const treeTrimming = findService("tree trimming");
    if (treeTrimming) {
      priceLists.push({
        service_id: treeTrimming._id,
        price_type: "fixed",
        fixed_price: 8000,
        description: "Fixed price per tree for trimming service (LKR)",
        isActive: true,
      });
    }

    // Cleaning Services
    const houseCleaning = findService("house cleaning");
    if (houseCleaning) {
      priceLists.push({
        service_id: houseCleaning._id,
        price_type: "fixed",
        fixed_price: 10000,
        description:
          "Standard house cleaning for small apartments (1-2 bedrooms) - LKR",
        isActive: true,
      });
      priceLists.push({
        service_id: houseCleaning._id,
        price_type: "fixed",
        fixed_price: 15000,
        description:
          "Standard house cleaning for medium homes (3-4 bedrooms) - LKR",
        isActive: true,
      });
    }

    const deepCleaning = findService("deep cleaning");
    if (deepCleaning) {
      priceLists.push({
        service_id: deepCleaning._id,
        price_type: "fixed",
        fixed_price: 20000,
        description: "Deep cleaning service for small apartments (LKR)",
        isActive: true,
      });
      priceLists.push({
        service_id: deepCleaning._id,
        price_type: "fixed",
        fixed_price: 30000,
        description: "Deep cleaning service for large homes (LKR)",
        isActive: true,
      });
    }

    const carpetCleaning = findService("carpet cleaning");
    if (carpetCleaning) {
      priceLists.push({
        service_id: carpetCleaning._id,
        price_type: "per_unit",
        unit_price: 1500,
        unit: "square_feet",
        description: "Price per square foot for carpet cleaning (LKR)",
        isActive: true,
      });
    }

    const windowCleaning = findService("window cleaning");
    if (windowCleaning) {
      priceLists.push({
        service_id: windowCleaning._id,
        price_type: "fixed",
        fixed_price: 3000,
        description: "Fixed price per window for cleaning service (LKR)",
        isActive: true,
      });
    }

    // Plumbing Services
    const plumbingRepair = findService("plumbing repair");
    if (plumbingRepair) {
      priceLists.push({
        service_id: plumbingRepair._id,
        price_type: "per_unit",
        unit_price: 8000,
        unit: "hour",
        description: "Plumbing repair service rate per hour (LKR)",
        isActive: true,
      });
    }

    const pipeInstallation = findService("pipe installation");
    if (pipeInstallation) {
      priceLists.push({
        service_id: pipeInstallation._id,
        price_type: "per_unit",
        unit_price: 1000,
        unit: "item",
        description: "Price per meter for pipe installation (LKR)",
        isActive: true,
      });
    }

    const leakFixing = findService("leak fixing");
    if (leakFixing) {
      priceLists.push({
        service_id: leakFixing._id,
        price_type: "fixed",
        fixed_price: 5000,
        description: "Fixed price for basic leak fixing (LKR)",
        isActive: true,
      });
      priceLists.push({
        service_id: leakFixing._id,
        price_type: "fixed",
        fixed_price: 15000,
        description: "Fixed price for complex leak fixing (LKR)",
        isActive: true,
      });
    }

    // Electrical Services
    const electricalRepair = findService("electrical repair");
    if (electricalRepair) {
      priceLists.push({
        service_id: electricalRepair._id,
        price_type: "per_unit",
        unit_price: 9000,
        unit: "hour",
        description: "Electrical repair service rate per hour (LKR)",
        isActive: true,
      });
    }

    const wiringInstallation = findService("wiring installation");
    if (wiringInstallation) {
      priceLists.push({
        service_id: wiringInstallation._id,
        price_type: "per_unit",
        unit_price: 1200,
        unit: "item",
        description: "Price per point for wiring installation (LKR)",
        isActive: true,
      });
    }

    const electricalMaintenance = findService("electrical maintenance");
    if (electricalMaintenance) {
      priceLists.push({
        service_id: electricalMaintenance._id,
        price_type: "fixed",
        fixed_price: 15000,
        description:
          "Fixed price for electrical safety check and maintenance (LKR)",
        isActive: true,
      });
    }

    // Carpentry Services
    const furnitureRepair = findService("furniture repair");
    if (furnitureRepair) {
      priceLists.push({
        service_id: furnitureRepair._id,
        price_type: "range",
        min_price: 3000,
        max_price: 15000,
        description:
          "Price range for furniture repair based on item size (LKR)",
        isActive: true,
      });
    }

    const cabinetInstallation = findService("cabinet installation");
    if (cabinetInstallation) {
      priceLists.push({
        service_id: cabinetInstallation._id,
        price_type: "per_unit",
        unit_price: 5000,
        unit: "item",
        description: "Price per cabinet for installation (LKR)",
        isActive: true,
      });
    }

    // Handyman Services
    const generalHandyman = findService("general handyman");
    if (generalHandyman) {
      priceLists.push({
        service_id: generalHandyman._id,
        price_type: "per_unit",
        unit_price: 4000,
        unit: "hour",
        description: "General handyman service rate per hour (LKR)",
        isActive: true,
      });
    }

    const applianceRepair = findService("appliance repair");
    if (applianceRepair) {
      priceLists.push({
        service_id: applianceRepair._id,
        price_type: "fixed",
        fixed_price: 5000,
        description: "Fixed price for basic appliance repair (LKR)",
        isActive: true,
      });
      priceLists.push({
        service_id: applianceRepair._id,
        price_type: "fixed",
        fixed_price: 15000,
        description: "Fixed price for complex appliance repair (LKR)",
        isActive: true,
      });
    }

    // Moving Services
    const houseMoving = findService("house moving");
    if (houseMoving) {
      priceLists.push({
        service_id: houseMoving._id,
        price_type: "range",
        min_price: 15000,
        max_price: 50000,
        description:
          "Price range for house moving based on distance and items (LKR)",
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

// Seed Reviews
const seedReviews = async (providers, customers) => {
  try {
    console.log("Seeding Reviews...");

    const reviews = [];

    // Helper function to get random element from array
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Get approved providers only (for realistic reviews)
    const approvedProviders = providers.filter((p) => p.isApproved === true);

    // Create reviews - mix of positive and constructive feedback
    const reviewComments = [
      // 5-star reviews
      {
        rating: 5,
        comments: [
          "Excellent service! Very professional and completed the work on time.",
          "Outstanding quality of work. Highly recommended!",
          "Great experience from start to finish. Will definitely hire again.",
          "Very satisfied with the service. Exceeded my expectations.",
          "Professional, punctual, and did an amazing job. Five stars!",
          "Best service provider I've worked with. Quality work at reasonable prices.",
          "Very reliable and skilled. The work was done perfectly.",
          "Excellent communication and great attention to detail.",
        ],
      },
      // 4-star reviews
      {
        rating: 4,
        comments: [
          "Good service overall. Minor delays but work quality was good.",
          "Satisfied with the work. Professional and courteous.",
          "Good job done. Would recommend to others.",
          "Quality work, though took a bit longer than expected.",
          "Very good service. Minor issues but overall happy.",
          "Professional service. Met expectations.",
          "Good work done. Would hire again.",
          "Satisfactory service with room for minor improvements.",
        ],
      },
      // 3-star reviews
      {
        rating: 3,
        comments: [
          "Average service. Work was done but could be better.",
          "Acceptable work but communication could improve.",
          "Service was okay, but took longer than promised.",
          "Work completed but quality was average.",
          "Met basic requirements but expected more attention to detail.",
        ],
      },
    ];

    // Create 30-40 reviews distributed across providers and customers
    const numReviews = 35;
    for (let i = 0; i < numReviews; i++) {
      const provider = getRandom(approvedProviders);
      const customer = getRandom(customers);
      const reviewType = getRandom(reviewComments);
      const comment = getRandom(reviewType.comments);

      reviews.push({
        provider_id: provider._id,
        customer_id: customer._id,
        rating: reviewType.rating,
        comment: comment,
        review_date: new Date(
          Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
        ), // Random date within last 90 days
      });
    }

    const createdReviews = await Review.insertMany(reviews);
    console.log(`${createdReviews.length} reviews created`);
    return createdReviews;
  } catch (error) {
    console.error("Error seeding reviews:", error);
    throw error;
  }
};

// Seed Job Posts
const seedJobPosts = async (customers, services) => {
  try {
    console.log("Seeding Job Posts...");

    const jobPosts = [];

    // Helper function to get random element from array
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Job post templates
    const jobTemplates = [
      {
        title: "Need Interior Painting for 3-Bedroom House",
        description:
          "Looking for an experienced painter to paint the interior of my 3-bedroom house. All rooms need fresh paint. Prefer light colors.",
        duration: "2 weeks",
        serviceName: "interior painting",
        location: "Colombo",
      },
      {
        title: "Garden Maintenance Service Required",
        description:
          "Need regular garden maintenance service for my home garden. Includes lawn mowing, weeding, and plant care.",
        duration: "1 month",
        serviceName: "garden maintenance",
        location: "Kandy",
      },
      {
        title: "Deep Cleaning Service for Office",
        description:
          "Require deep cleaning service for a small office space. Need thorough cleaning of all areas including carpets.",
        duration: "1 day",
        serviceName: "deep cleaning",
        location: "Gampaha",
      },
      {
        title: "Plumbing Repair - Leaky Faucets",
        description:
          "Multiple faucets in the house are leaking. Need professional plumber to fix all leaks and check water pressure.",
        duration: "1 day",
        serviceName: "plumbing repair",
        location: "Negombo",
      },
      {
        title: "Electrical Wiring Installation",
        description:
          "Need new electrical wiring for home extension. Requires licensed electrician for safe installation.",
        duration: "1 week",
        serviceName: "wiring installation",
        location: "Matara",
      },
      {
        title: "House Cleaning - Weekly Service",
        description:
          "Looking for regular weekly house cleaning service. 2-bedroom apartment needs cleaning every week.",
        duration: "3 months",
        serviceName: "house cleaning",
        location: "Colombo",
      },
      {
        title: "Exterior Painting - Weatherproofing",
        description:
          "Need exterior painting and weatherproofing for house exterior. Includes preparation and primer application.",
        duration: "2 weeks",
        serviceName: "exterior painting",
        location: "Kurunegala",
      },
      {
        title: "Tree Trimming and Pruning",
        description:
          "Large trees in garden need trimming and pruning. Some branches are overhanging the roof.",
        duration: "1 day",
        serviceName: "tree trimming",
        location: "Galle",
      },
      {
        title: "Carpet Cleaning Service",
        description:
          "Need professional carpet cleaning for living room and bedrooms. Carpets are heavily soiled.",
        duration: "1 day",
        serviceName: "carpet cleaning",
        location: "Ratnapura",
      },
      {
        title: "Window Cleaning - Commercial Building",
        description:
          "Window cleaning service required for 3-story commercial building. All windows need cleaning inside and out.",
        duration: "3 days",
        serviceName: "window cleaning",
        location: "Colombo",
      },
      {
        title: "Pipe Installation - New Construction",
        description:
          "New pipe installation needed for kitchen and bathroom in new construction. Requires experienced plumber.",
        duration: "1 week",
        serviceName: "pipe installation",
        location: "Anuradhapura",
      },
      {
        title: "Leak Fixing - Multiple Locations",
        description:
          "Water leaks detected in multiple locations. Need urgent leak detection and fixing service.",
        duration: "2 days",
        serviceName: "leak fixing",
        location: "Kandy",
      },
      {
        title: "Electrical Repair - Power Issues",
        description:
          "Experiencing power issues in several rooms. Need licensed electrician to diagnose and repair electrical problems.",
        duration: "2 days",
        serviceName: "electrical repair",
        location: "Gampaha",
      },
      {
        title: "Electrical Maintenance Check",
        description:
          "Annual electrical safety check and maintenance required. Need comprehensive inspection of all electrical systems.",
        duration: "1 day",
        serviceName: "electrical maintenance",
        location: "Negombo",
      },
      {
        title: "Furniture Repair Service",
        description:
          "Several pieces of furniture need repair and restoration. Includes chairs, tables, and cabinets.",
        duration: "1 week",
        serviceName: "furniture repair",
        location: "Matara",
      },
      {
        title: "Cabinet Installation - Kitchen",
        description:
          "Need custom cabinet installation in kitchen. Requires skilled carpenter for proper fitting and installation.",
        duration: "1 week",
        serviceName: "cabinet installation",
        location: "Colombo",
      },
      {
        title: "General Handyman - Multiple Repairs",
        description:
          "Multiple small repairs needed around the house. Looking for experienced handyman for various tasks.",
        duration: "1 week",
        serviceName: "general handyman",
        location: "Kandy",
      },
      {
        title: "Appliance Repair - Washing Machine",
        description:
          "Washing machine not working properly. Need experienced technician to diagnose and repair the issue.",
        duration: "1 day",
        serviceName: "appliance repair",
        location: "Gampaha",
      },
      {
        title: "Landscaping Project - Garden Design",
        description:
          "Complete landscaping project for new garden. Need design and implementation of garden layout with plants and features.",
        duration: "1 month",
        serviceName: "landscaping",
        location: "Colombo",
      },
      {
        title: "House Moving Service",
        description:
          "Need professional house moving service for relocation. Includes packing, transportation, and unpacking.",
        duration: "2 days",
        serviceName: "house moving",
        location: "Colombo",
      },
    ];

    // Create job posts (no status - all are immediately active)
    for (const template of jobTemplates) {
      // Find matching service
      const service = services.find(
        (s) => s.name.toLowerCase() === template.serviceName.toLowerCase()
      );

      if (!service) continue;

      // Select random customer
      const customer = getRandom(customers);

      jobPosts.push({
        title: template.title,
        description: template.description,
        duration: template.duration,
        service_id: service._id,
        location: template.location,
        customerId: customer._id,
        applications: [], // Start with no applications
      });
    }

    const createdJobPosts = await JobPost.insertMany(jobPosts);
    console.log(`${createdJobPosts.length} job posts created`);

    // Add some provider applications to job posts
    const allProviders = await Provider.find({ isApproved: true }).select(
      "_id"
    );

    // Add random applications to some jobs (mix of applied, approved, rejected)
    const applicationStatuses = ["applied", "approved", "rejected"];
    const statusWeights = [0.5, 0.3, 0.2]; // 50% applied, 30% approved, 20% rejected

    for (let i = 0; i < Math.min(15, createdJobPosts.length); i++) {
      const jobPost = createdJobPosts[i];
      const numApplications = Math.floor(Math.random() * 3) + 1; // 1-3 applications

      for (let j = 0; j < numApplications; j++) {
        const provider = getRandom(allProviders);
        
        // Check if provider already applied
        const alreadyApplied = jobPost.applications.some(
          (app) => app.providerId.toString() === provider._id.toString()
        );
        
        if (!alreadyApplied) {
          // Select status based on weights
          const random = Math.random();
          let status = "applied";
          if (random < statusWeights[0]) {
            status = "applied";
          } else if (random < statusWeights[0] + statusWeights[1]) {
            status = "approved";
          } else {
            status = "rejected";
          }

          jobPost.applications.push({
            providerId: provider._id,
            status: status,
            appliedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last 7 days
          });
        }
      }
      await jobPost.save();
    }

    return createdJobPosts;
  } catch (error) {
    console.error("Error seeding job posts:", error);
    throw error;
  }
};

// Seed Subscriptions
const seedSubscriptions = async (providers) => {
  try {
    console.log("Seeding Subscriptions...");

    const subscriptions = [];

    // Helper function to get random element from array
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Get approved providers only (subscriptions are for approved providers)
    const approvedProviders = providers.filter((p) => p.isApproved === true);

    // Subscription plans with pricing (in LKR)
    const plans = [
      {
        plan_name: "Free",
        amount: 0,
        duration_days: 30, // 1 month
      },
      {
        plan_name: "Standard",
        amount: 5000, // Rs. 5,000 per month
        duration_days: 30,
      },
      {
        plan_name: "Premium",
        amount: 10000, // Rs. 10,000 per month
        duration_days: 30,
      },
    ];

    // Create subscriptions for 60% of approved providers
    const numSubscriptions = Math.floor(approvedProviders.length * 0.6);
    const providersWithSubscriptions = approvedProviders
      .sort(() => Math.random() - 0.5)
      .slice(0, numSubscriptions);

    for (const provider of providersWithSubscriptions) {
      const plan = getRandom(plans);
      const startDate = new Date(
        Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000
      ); // Random date within last 60 days
      const endDate = new Date(
        startDate.getTime() + plan.duration_days * 24 * 60 * 60 * 1000
      );

      // Determine status based on end date
      let status = "Active";
      if (endDate < new Date()) {
        status = getRandom(["Expired", "Cancelled"]);
      }

      // Calculate renewal date (30 days after end date if active)
      let renewalDate = null;
      if (status === "Active") {
        renewalDate = new Date(
          endDate.getTime() + plan.duration_days * 24 * 60 * 60 * 1000
        );
      }

      subscriptions.push({
        provider_id: provider._id,
        plan_name: plan.plan_name,
        start_date: startDate,
        end_date: endDate,
        renewal_date: renewalDate,
        status: status,
        amount: plan.amount,
      });
    }

    const createdSubscriptions = await Subscription.insertMany(subscriptions);
    console.log(`${createdSubscriptions.length} subscriptions created`);
    return createdSubscriptions;
  } catch (error) {
    console.error("Error seeding subscriptions:", error);
    throw error;
  }
};

// --------------------
// 3. Seed Function
// --------------------
async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Provider.deleteMany();
    await Customer.deleteMany();
    await Service.deleteMany();
    await PriceList.deleteMany();
    await Review.deleteMany();
    await JobPost.deleteMany();
    await Subscription.deleteMany();

    console.log("Old data removed");

    // Hash password for all users
    const hashedPassword = await bcrypt.hash("Password123", 10);

    const providerData = providers.map((p) => ({
      ...p,
      password: hashedPassword,
    }));

    const customerData = customers.map((c) => ({
      ...c,
      password: hashedPassword,
    }));

    // Insert providers and customers
    const createdProviders = await Provider.insertMany(providerData);
    const createdCustomers = await Customer.insertMany(customerData);
    console.log("Providers and customers seeded");

    // Seed services and price lists
    const services = await seedServices();
    const priceLists = await seedPriceLists(services);

    // Seed reviews (after providers and customers are created)
    const reviews = await seedReviews(createdProviders, createdCustomers);

    // Seed job posts (after services and customers are created)
    const jobPosts = await seedJobPosts(createdCustomers, services);

    // Seed subscriptions (after providers are created)
    const subscriptions = await seedSubscriptions(createdProviders);

    // Summary
    console.log("=".repeat(50));
    console.log("Seeding Summary:");
    console.log("=".repeat(50));
    console.log(`Providers: ${providerData.length}`);
    console.log(`Customers: ${customerData.length}`);
    console.log(`Services: ${services.length}`);
    console.log(`Price Lists: ${priceLists.length}`);
    console.log(`Reviews: ${reviews.length}`);
    console.log(`Job Posts: ${jobPosts.length}`);
    console.log(`Subscriptions: ${subscriptions.length}`);
    console.log("=".repeat(50));
    console.log("Seed successfully completed");
    console.log("");
    console.log("Example Price Lists:");
    console.log(" - Painting: Rs. 200-300 per square foot");
    console.log(
      " - Gardening: Rs. 5,000-15,000 (maintenance) or Rs. 20,000-100,000 (landscaping)"
    );
    console.log(" - Cleaning: Rs. 10,000-30,000 (house/deep cleaning)");
    console.log(
      " - Plumbing: Rs. 5,000-15,000 (leak fixing) or Rs. 8,000/hour (repairs)"
    );
    console.log(
      " - Electrical: Rs. 9,000/hour (repairs) or Rs. 15,000 (maintenance)"
    );
    console.log(
      " - Carpentry: Rs. 3,000-15,000 (furniture repair) or Rs. 5,000/cabinet"
    );
    console.log(
      " - Handyman: Rs. 4,000/hour (general) or Rs. 5,000-15,000 (appliance repair)"
    );
    console.log(" - Moving: Rs. 15,000-50,000 (based on distance and items)");
    console.log("");

    process.exit();
  } catch (error) {
    console.error("Seed failed", error);
    process.exit(1);
  }
}

seedUsers();
