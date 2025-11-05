import Provider from "../models/Provider.js";

// Get all provider
export const getAllProviders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  try {
    const providers = await Provider.find()
      .skip((page - 1) * limit) // Skip documents for previous pages
      .limit(parseInt(limit)); // Limit the number of documents;;

    res.status(200).json({
      length: providers.length,
      page,
      limit,
      providers,
    });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

// Get a provider by Id
export const getProviderById = async (req, res) => {
  try {
    const providerId = req.params.id;
    const provider = await Provider.findById({ _id: providerId });

    if (!provider)
      return res.status(404).json({ Message: "Provider not found" });

    res.status(200).json(provider);
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

// Create a provider
export const createProvider = async (req, res) => {
  try {
    const newProvider = new Provider(req.body);

    const savedProvider = await newProvider.save();
    res.status(200).json({
      Message: "provider created successfully",
      provider: savedProvider,
    });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

// Update a provider by Id
export const updateProvider = async (req, res) => {
  try {
    const providerId = req.params.id;
    const providerExist = await Provider.findById({ _id: providerId });
    if (!providerExist)
      return res.status(404).json({ Error: "provider not found" });

    const updatedProvider = await Provider.findByIdAndUpdate(
      providerId,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({
      Message: "provider updated successfully",
      provider: updatedProvider,
    });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

// Delete a provider by Id
export const deleteProvider = async (req, res) => {
  try {
    const providerId = req.params.id;
    const provider = await Provider.findByIdAndDelete(providerId);
    if (!provider)
      return res.status(404).json({ Message: "provider not found" });
    res.status(200).json({
      Message: "provider removed successfully",
      deletedProvider: provider,
    });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};
