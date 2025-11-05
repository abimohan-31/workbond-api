import Review from "../models/Review.js";

// Get all review
export const getAllReviews = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  try {
    const reviews = await Review.find()
      .skip((page - 1) * limit) // Skip documents for previous pages
      .limit(parseInt(limit)); // Limit the number of documents;;

    res.status(200).json({
      length: reviews.length,
      page,
      limit,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

// Get a review by Id
export const getReviewById = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findById({ _id: reviewId });

    if (!review) return res.status(404).json({ Message: "Review not found" });

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

// Create a review
export const createReview = async (req, res) => {
  try {
    const newReview = new Review(req.body);

    const savedReview = await newReview.save();
    res.status(200).json({
      Message: "review created successfully",
      review: savedReview,
    });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

// Update a review by Id
export const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const reviewExist = await Review.findById({ _id: reviewId });
    if (!reviewExist)
      return res.status(404).json({ Error: "review not found" });

    const updatedReview = await Review.findByIdAndUpdate(reviewId, req.body, {
      new: true,
    });
    res.status(200).json({
      Message: "review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

// Delete a review by Id
export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) return res.status(404).json({ Message: "review not found" });
    res.status(200).json({
      Message: "review removed successfully",
      deletedReview: review,
    });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};
