import Subscription from "../models/Subscription.js";

// Get all subscription
export const getAllSubscriptions = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  try {
    const subscriptions = await Subscription.find()
      .skip((page - 1) * limit) // Skip documents for previous pages
      .limit(parseInt(limit)) // Limit the number of documents;;
      .populate("provider_id", "name email");
    res.status(200).json({
      length: subscriptions.length,
      page,
      limit,
      subscriptions,
    });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

// Get a subscription by Id
export const getSubscriptionById = async (req, res) => {
  try {
    const subscriptionId = req.params.id;
    const subscription = await Subscription.findById({
      _id: subscriptionId,
    }).populate("provider_id", "name email");

    if (!subscription)
      return res.status(404).json({ Message: "Subscription not found" });

    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

// Create a subscription
export const createSubscription = async (req, res) => {
  try {
    const newSubscription = new Subscription(req.body);

    const savedSubscription = await newSubscription.save();
    res.status(200).json({
      Message: "subscription created successfully",
      subscription: savedSubscription,
    });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

// Update a subscription by Id
export const updateSubscription = async (req, res) => {
  try {
    const subscriptionId = req.params.id;
    const subscriptionExist = await Subscription.findById(subscriptionId);
    if (!subscriptionExist)
      return res.status(404).json({ Error: "subscription not found" });

    const updatedSubscription = await Subscription.findByIdAndUpdate(
      subscriptionId,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({
      Message: "subscription updated successfully",
      subscription: updatedSubscription,
    });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

// Delete a subscription by Id
export const deleteSubscription = async (req, res) => {
  try {
    const subscriptionId = req.params.id;
    const subscription = await Subscription.findByIdAndDelete(subscriptionId);
    if (!subscription)
      return res.status(404).json({ Message: "Subscription not found" });
    res.status(200).json({
      Message: "Subscription removed successfully",
      deletedSubscription: subscription,
    });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};
