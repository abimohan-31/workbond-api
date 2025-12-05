import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import Provider from "./src/models/Provider.js";
import Customer from "./src/models/Customer.js";
import Service from "./src/models/Service.js";
import JobPost from "./src/models/JobPost.js";
import WorkPost from "./src/models/WorkPost.js";
import Review from "./src/models/Review.js";
import Subscription from "./src/models/Subscription.js";
import PriceList from "./src/models/PriceList.js";

dotenv.config();

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedProviders = async () => {
  console.log("Seeding Providers...");
  const skillsOptions = [
    ["Plumbing", "Maintenance"],
    ["Electrician", "Repairing"],
    ["Plumbing", "Repairing"],
    ["Cleaning", "Gardening"],
    ["Gardening"],
    ["Painting"],
    ["Electrician"],
    ["Cleaning"],
    ["Plumbing"],
  ];

  const locations = [
    "Colombo",
    "Gampaha",
    "Kandy",
    "Negombo",
    "Matara",
    "Kurunegala",
    "Ratnapura",
    "Jaffna",
    "Anuradhapura",
    "Kegalle",
    "Galle",
    "Matale",
    "Trincomalee",
    "Badulla",
    "Hambantota",
    "Nuwara Eliya",
    "Polonnaruwa",
    "Batticaloa",
    "Mannar",
    "Vavuniya",
  ];

  const hashedPassword = await bcrypt.hash("Password123", 10);

  const providers = [];
  for (let i = 0; i < 20; i++) {
    providers.push({
      name: `Provider ${i + 1}`,
      email: `provider${i + 1}@example.com`,
      password: hashedPassword,
      phone: `07${String(i).padStart(8, "0")}`,
      address: locations[i],
      experience_years: Math.floor(Math.random() * 10) + 1,
      skills: skillsOptions[i],
      availability_status: getRandom(["Available", "Unavailable"]),
      rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
      profileImage: null,
      isActive: true,
      isApproved: Math.random() > 0.3,
    });
  }

  const created = await Provider.insertMany(providers);
  console.log(`${created.length} providers created`);
  return created;
};

const seedCustomers = async () => {
  console.log("Seeding Customers...");
  const locations = [
    "Colombo",
    "Gampaha",
    "Kandy",
    "Negombo",
    "Matara",
    "Kurunegala",
    "Ratnapura",
    "Jaffna",
    "Anuradhapura",
    "Kegalle",
    "Galle",
    "Matale",
    "Trincomalee",
    "Badulla",
    "Hambantota",
    "Nuwara Eliya",
    "Polonnaruwa",
    "Batticaloa",
    "Mannar",
    "Vavuniya",
  ];

  const hashedPassword = await bcrypt.hash("Password123", 10);

  const customers = [];
  for (let i = 0; i < 20; i++) {
    customers.push({
      name: `Customer ${i + 1}`,
      email: `customer${i + 1}@example.com`,
      password: hashedPassword,
      phone: `07${String(i + 20).padStart(8, "0")}`,
      address: locations[i],
      profileImage: null,
      role: "customer",
      isActive: true,
    });
  }

  const created = await Customer.insertMany(customers);
  console.log(`${created.length} customers created`);
  return created;
};

const seedServices = async () => {
  console.log("Seeding Services...");
  const servicesData = [
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
      name: "garden maintenance",
      description: "Regular garden maintenance and lawn care services",
      category: "Gardening",
      base_price: 4000,
      unit: "hour",
      isActive: true,
    },
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
      name: "plumbing repair",
      description: "Professional plumbing repairs and maintenance",
      category: "Plumbing",
      base_price: 6000,
      unit: "hour",
      isActive: true,
    },
    {
      name: "electrical repair",
      description: "Licensed electrical repairs and troubleshooting",
      category: "Electrical",
      base_price: 7000,
      unit: "hour",
      isActive: true,
    },
    {
      name: "furniture repair",
      description: "Professional furniture repair and restoration services",
      category: "Carpentry",
      base_price: 5000,
      unit: "hour",
      isActive: true,
    },
    {
      name: "general handyman",
      description: "General handyman services for various home repairs",
      category: "Handyman",
      base_price: 4000,
      unit: "hour",
      isActive: true,
    },
    {
      name: "house moving",
      description: "Professional house moving and relocation services",
      category: "Moving",
      base_price: 10000,
      unit: "day",
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
    {
      name: "landscaping",
      description: "Complete landscaping and garden design services",
      category: "Gardening",
      base_price: 8000,
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
      name: "pipe installation",
      description: "New pipe installation and replacement services",
      category: "Plumbing",
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
      name: "cabinet installation",
      description: "Custom cabinet and shelf installation services",
      category: "Carpentry",
      base_price: 6000,
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
    {
      name: "window cleaning",
      description:
        "Window and glass cleaning services for residential and commercial",
      category: "Cleaning",
      base_price: 2500,
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
    {
      name: "electrical maintenance",
      description: "Regular electrical maintenance and safety checks",
      category: "Electrical",
      base_price: 6500,
      unit: "hour",
      isActive: true,
    },
  ];

  const created = await Service.insertMany(servicesData);
  console.log(`${created.length} services created`);
  return created;
};

const seedJobPosts = async (customers, services) => {
  console.log("Seeding Job Posts...");
  const durations = [
    "1 day",
    "2 days",
    "1 week",
    "2 weeks",
    "1 month",
    "3 months",
  ];
  const locations = [
    "Colombo",
    "Gampaha",
    "Kandy",
    "Negombo",
    "Matara",
    "Kurunegala",
    "Ratnapura",
    "Jaffna",
    "Anuradhapura",
    "Kegalle",
    "Galle",
    "Matale",
    "Trincomalee",
    "Badulla",
    "Hambantota",
    "Nuwara Eliya",
    "Polonnaruwa",
    "Batticaloa",
    "Mannar",
    "Vavuniya",
  ];

  const jobTitles = [
    "Need Interior Painting for 3-Bedroom House",
    "Garden Maintenance Service Required",
    "Deep Cleaning Service for Office",
    "Plumbing Repair - Leaky Faucets",
    "Electrical Wiring Installation",
    "House Cleaning - Weekly Service",
    "Exterior Painting - Weatherproofing",
    "Tree Trimming and Pruning",
    "Carpet Cleaning Service",
    "Window Cleaning - Commercial Building",
    "Pipe Installation - New Construction",
    "Leak Fixing - Multiple Locations",
    "Electrical Repair - Power Issues",
    "Electrical Maintenance Check",
    "Furniture Repair Service",
    "Cabinet Installation - Kitchen",
    "General Handyman - Multiple Repairs",
    "Appliance Repair - Washing Machine",
    "Landscaping Project - Garden Design",
    "House Moving Service",
  ];

  const jobDescriptions = [
    "Looking for an experienced painter to paint the interior of my 3-bedroom house. All rooms need fresh paint.",
    "Need regular garden maintenance service for my home garden. Includes lawn mowing, weeding, and plant care.",
    "Require deep cleaning service for a small office space. Need thorough cleaning of all areas including carpets.",
    "Multiple faucets in the house are leaking. Need professional plumber to fix all leaks and check water pressure.",
    "Need new electrical wiring for home extension. Requires licensed electrician for safe installation.",
    "Looking for regular weekly house cleaning service. 2-bedroom apartment needs cleaning every week.",
    "Need exterior painting and weatherproofing for house exterior. Includes preparation and primer application.",
    "Large trees in garden need trimming and pruning. Some branches are overhanging the roof.",
    "Need professional carpet cleaning for living room and bedrooms. Carpets are heavily soiled.",
    "Window cleaning service required for 3-story commercial building. All windows need cleaning inside and out.",
    "New pipe installation needed for kitchen and bathroom in new construction. Requires experienced plumber.",
    "Water leaks detected in multiple locations. Need urgent leak detection and fixing service.",
    "Experiencing power issues in several rooms. Need licensed electrician to diagnose and repair electrical problems.",
    "Annual electrical safety check and maintenance required. Need comprehensive inspection of all electrical systems.",
    "Several pieces of furniture need repair and restoration. Includes chairs, tables, and cabinets.",
    "Need custom cabinet installation in kitchen. Requires skilled carpenter for proper fitting and installation.",
    "Multiple small repairs needed around the house. Looking for experienced handyman for various tasks.",
    "Washing machine not working properly. Need experienced technician to diagnose and repair the issue.",
    "Complete landscaping project for new garden. Need design and implementation of garden layout with plants and features.",
    "Need professional house moving service for relocation. Includes packing, transportation, and unpacking.",
  ];

  const jobPosts = [];
  for (let i = 0; i < 20; i++) {
    const customer = getRandom(customers);
    const service = getRandom(services);
    const status = getRandom(["open", "in_progress", "completed", "cancelled"]);

    jobPosts.push({
      title: jobTitles[i],
      description: jobDescriptions[i],
      duration: getRandom(durations),
      service_id: service._id,
      location: locations[i],
      customerId: customer._id,
      applications: [],
      jobStatus: status,
      assignedProviderId: null,
    });
  }

  const created = await JobPost.insertMany(jobPosts);
  console.log(`${created.length} job posts created`);
  return created;
};

const seedWorkPosts = async (providers, jobPosts, services, customers) => {
  console.log("Seeding Work Posts...");
  const workTitles = [
    "Kitchen Renovation Project",
    "Bathroom Tile Installation",
    "Living Room Painting",
    "Garden Landscaping Complete",
    "Office Deep Cleaning",
    "Plumbing System Overhaul",
    "Electrical Panel Upgrade",
    "Furniture Restoration Work",
    "Handyman Multi-Task Project",
    "House Moving Completed",
    "Wall Painting Project",
    "Garden Maintenance Service",
    "Carpet Deep Cleaning",
    "Pipe Replacement Work",
    "Wiring Installation Complete",
    "Cabinet Installation Project",
    "Appliance Repair Service",
    "Window Cleaning Service",
    "Leak Fixing Project",
    "Electrical Safety Check",
  ];

  const categories = [
    "Home Renovation",
    "Plumbing & Tiling",
    "Painting",
    "Gardening",
    "Cleaning",
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Handyman",
    "Moving",
    "Painting",
    "Gardening",
    "Cleaning",
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Handyman",
    "Cleaning",
    "Plumbing",
    "Electrical",
  ];

  const feedbacks = [
    "Excellent work, very professional and clean finish",
    "Outstanding quality, exceeded expectations",
    "Great service, completed on time",
    "Very satisfied with the results",
    "Professional and courteous service",
    "High quality workmanship",
    "Excellent communication throughout",
    "Would definitely recommend",
    "Very reliable and skilled",
    "Perfect execution of the project",
    "Great attention to detail",
    "Professional service delivery",
    "Very happy with the outcome",
    "Excellent work quality",
    "Outstanding professional service",
    "Great experience overall",
    "Very satisfied customer",
    "Excellent job done",
    "Professional and efficient",
    "Great quality work",
  ];

  const workPosts = [];
  const approvedProviders = providers.filter((p) => p.isApproved);
  const completedJobs = jobPosts.filter((j) => j.jobStatus === "completed");

  for (let i = 0; i < 20; i++) {
    const provider = getRandom(
      approvedProviders.length > 0 ? approvedProviders : providers
    );
    let jobPost = null;
    let serviceId = null;
    let customerId = null;

    if (completedJobs.length > 0 && Math.random() > 0.4) {
      jobPost = getRandom(completedJobs);
      serviceId = jobPost.service_id;
      customerId = jobPost.customerId;
    } else {
      serviceId = getRandom(services)._id;
      customerId = getRandom(customers)._id;
    }

    workPosts.push({
      title: workTitles[i],
      description: `Completed ${workTitles[
        i
      ].toLowerCase()} with excellent results`,
      beforeImage: `https://example.com/images/before-${i + 1}.jpg`,
      afterImage: `https://example.com/images/after-${i + 1}.jpg`,
      category: categories[i],
      providerId: provider._id,
      jobPostId: jobPost ? jobPost._id : null,
      service_id: serviceId,
      customerId: customerId,
      completedAt: new Date(
        Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
      ),
      customerFeedback: feedbacks[i],
      isPublic: Math.random() > 0.2,
    });
  }

  const created = await WorkPost.insertMany(workPosts);
  console.log(`${created.length} work posts created`);
  return created;
};

const seedReviews = async (providers, customers) => {
  console.log("Seeding Reviews...");
  const comments = [
    "Excellent service! Very professional and completed the work on time.",
    "Outstanding quality of work. Highly recommended!",
    "Great experience from start to finish. Will definitely hire again.",
    "Very satisfied with the service. Exceeded my expectations.",
    "Professional, punctual, and did an amazing job. Five stars!",
    "Best service provider I've worked with. Quality work at reasonable prices.",
    "Very reliable and skilled. The work was done perfectly.",
    "Excellent communication and great attention to detail.",
    "Good service overall. Minor delays but work quality was good.",
    "Satisfied with the work. Professional and courteous.",
    "Good job done. Would recommend to others.",
    "Quality work, though took a bit longer than expected.",
    "Very good service. Minor issues but overall happy.",
    "Professional service. Met expectations.",
    "Good work done. Would hire again.",
    "Satisfactory service with room for minor improvements.",
    "Average service. Work was done but could be better.",
    "Acceptable work but communication could improve.",
    "Service was okay, but took longer than promised.",
    "Work completed but quality was average.",
  ];

  const ratings = [5, 5, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3];
  const approvedProviders = providers.filter((p) => p.isApproved);

  const reviews = [];
  for (let i = 0; i < 20; i++) {
    const provider = getRandom(
      approvedProviders.length > 0 ? approvedProviders : providers
    );
    const customer = getRandom(customers);

    reviews.push({
      customer_id: customer._id,
      provider_id: provider._id,
      rating: ratings[i],
      comment: comments[i],
      review_date: new Date(
        Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
      ),
    });
  }

  const created = await Review.insertMany(reviews);
  console.log(`${created.length} reviews created`);
  return created;
};

const seedSubscriptions = async (providers) => {
  console.log("Seeding Subscriptions...");
  const plans = [
    { plan_name: "Free", amount: 0 },
    { plan_name: "Standard", amount: 5000 },
    { plan_name: "Premium", amount: 10000 },
  ];

  const statuses = ["Active", "Expired", "Cancelled"];
  const approvedProviders = providers.filter((p) => p.isApproved);

  const subscriptions = [];
  for (let i = 0; i < 20; i++) {
    const provider = getRandom(
      approvedProviders.length > 0 ? approvedProviders : providers
    );
    const plan = getRandom(plans);
    const startDate = new Date(
      Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000
    );
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const status =
      endDate < new Date() ? getRandom(["Expired", "Cancelled"]) : "Active";
    const renewalDate =
      status === "Active"
        ? new Date(endDate.getTime() + 30 * 24 * 60 * 60 * 1000)
        : null;

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

  const created = await Subscription.insertMany(subscriptions);
  console.log(`${created.length} subscriptions created`);
  return created;
};

const seedPriceLists = async (services) => {
  console.log("Seeding Price Lists...");
  const priceLists = [];

  for (let i = 0; i < 20; i++) {
    const service = services[i % services.length];
    let priceList = {};

    if (i % 3 === 0) {
      priceList = {
        service_id: service._id,
        price_type: "fixed",
        fixed_price: Math.floor(Math.random() * 20000) + 5000,
        description: `Fixed price for ${service.name}`,
        isActive: true,
      };
    } else if (i % 3 === 1) {
      priceList = {
        service_id: service._id,
        price_type: "per_unit",
        unit_price: Math.floor(Math.random() * 1000) + 500,
        unit: getRandom(["hour", "day", "item", "square_feet"]),
        description: `Per unit price for ${service.name}`,
        isActive: true,
      };
    } else {
      const minPrice = Math.floor(Math.random() * 10000) + 5000;
      priceList = {
        service_id: service._id,
        price_type: "range",
        min_price: minPrice,
        max_price: minPrice + Math.floor(Math.random() * 20000) + 10000,
        description: `Price range for ${service.name}`,
        isActive: true,
      };
    }

    priceLists.push(priceList);
  }

  const created = await PriceList.insertMany(priceLists);
  console.log(`${created.length} price lists created`);
  return created;
};

const seedAll = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    console.log("Clearing existing data...");
    await Provider.deleteMany();
    await Customer.deleteMany();
    await Service.deleteMany();
    await JobPost.deleteMany();
    await WorkPost.deleteMany();
    await Review.deleteMany();
    await Subscription.deleteMany();
    await PriceList.deleteMany();
    console.log("Existing data cleared");

    const providers = await seedProviders();
    const customers = await seedCustomers();
    const services = await seedServices();
    const jobPosts = await seedJobPosts(customers, services);
    const workPosts = await seedWorkPosts(
      providers,
      jobPosts,
      services,
      customers
    );
    const reviews = await seedReviews(providers, customers);
    const subscriptions = await seedSubscriptions(providers);
    const priceLists = await seedPriceLists(services);

    console.log("=".repeat(50));
    console.log("Seeding Summary:");
    console.log("=".repeat(50));
    console.log(`Providers: ${providers.length}`);
    console.log(`Customers: ${customers.length}`);
    console.log(`Services: ${services.length}`);
    console.log(`Job Posts: ${jobPosts.length}`);
    console.log(`Work Posts: ${workPosts.length}`);
    console.log(`Reviews: ${reviews.length}`);
    console.log(`Subscriptions: ${subscriptions.length}`);
    console.log(`Price Lists: ${priceLists.length}`);
    console.log("=".repeat(50));
    console.log("Done!");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedAll();
