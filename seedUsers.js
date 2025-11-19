import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Import models from src
import Provider from "./src/models/Provider.js";
import Customer from "./src/models/Customer.js";
import Service from "./src/models/Service.js";
import PriceList from "./src/models/PriceList.js";

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
    role: "customer",
    isActive: true,
  },
  {
    name: "Sajini Perera",
    email: "sajini.customer2@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Dilshan Jayawardena",
    email: "dilshan.customer3@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Nadeesha Fernando",
    email: "nadeesha.customer4@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Ishara Madushani",
    email: "ishara.customer5@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Ravindu Silva",
    email: "ravindu.customer6@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Gayani Dias",
    email: "gayani.customer7@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Kaveesha Ratnayake",
    email: "kaveesha.customer8@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Sathsara Gunasekara",
    email: "sathsara.customer9@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Harshi Aluwihare",
    email: "harshi.customer10@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Sanjula Karunaratne",
    email: "sanjula.customer11@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Nimashi Ranathunga",
    email: "nimashi.customer12@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Kalpa Abeysekara",
    email: "kalpa.customer13@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Vindya Udayanga",
    email: "vindya.customer14@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Malith Peris",
    email: "malith.customer15@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Yasas Muthumala",
    email: "yasas.customer16@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Chathuni Ekanayake",
    email: "chathuni.customer17@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Sachintha Prabath",
    email: "sachintha.customer18@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Nirasha Herath",
    email: "nirasha.customer19@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Ayesh Fonseka",
    email: "ayesh.customer20@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Thilini Samarasekara",
    email: "thilini.customer21@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Chamod Lakshan",
    email: "chamod.customer22@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Pavani Senanayake",
    email: "pavani.customer23@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Ramesh Priyadarshana",
    email: "ramesh.customer24@example.com",
    role: "customer",
    isActive: true,
  },
  {
    name: "Imesha Wijeratne",
    email: "imesha.customer25@example.com",
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
        description: "Professional interior painting services for homes and offices",
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
        description: "Comprehensive house cleaning services for residential spaces",
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
        description: "Window and glass cleaning services for residential and commercial",
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
        description: "Standard house cleaning for small apartments (1-2 bedrooms) - LKR",
        isActive: true,
      });
      priceLists.push({
        service_id: houseCleaning._id,
        price_type: "fixed",
        fixed_price: 15000,
        description: "Standard house cleaning for medium homes (3-4 bedrooms) - LKR",
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
        description: "Fixed price for electrical safety check and maintenance (LKR)",
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
        description: "Price range for furniture repair based on item size (LKR)",
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
        description: "Price range for house moving based on distance and items (LKR)",
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
    await Provider.insertMany(providerData);
    await Customer.insertMany(customerData);
    console.log("Providers and customers seeded");

    // Seed services and price lists
    const services = await seedServices();
    const priceLists = await seedPriceLists(services);

    // Summary
    console.log("=".repeat(50));
    console.log("Seeding Summary:");
    console.log("=".repeat(50));
    console.log(`Providers: ${providerData.length}`);
    console.log(`Customers: ${customerData.length}`);
    console.log(`Services: ${services.length}`);
    console.log(`Price Lists: ${priceLists.length}`);
    console.log("=".repeat(50));
    console.log("Seed successfully completed");
    console.log("");
    console.log("Example Price Lists:");
    console.log(" - Painting: Rs. 200-300 per square foot");
    console.log(" - Gardening: Rs. 5,000-15,000 (maintenance) or Rs. 20,000-100,000 (landscaping)");
    console.log(" - Cleaning: Rs. 10,000-30,000 (house/deep cleaning)");
    console.log(" - Plumbing: Rs. 5,000-15,000 (leak fixing) or Rs. 8,000/hour (repairs)");
    console.log(" - Electrical: Rs. 9,000/hour (repairs) or Rs. 15,000 (maintenance)");
    console.log(" - Carpentry: Rs. 3,000-15,000 (furniture repair) or Rs. 5,000/cabinet");
    console.log(" - Handyman: Rs. 4,000/hour (general) or Rs. 5,000-15,000 (appliance repair)");
    console.log(" - Moving: Rs. 15,000-50,000 (based on distance and items)");
    console.log("");

    process.exit();
  } catch (error) {
    console.error("Seed failed", error);
    process.exit(1);
  }
}

seedUsers();

