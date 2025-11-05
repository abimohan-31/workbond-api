import Payment from "../models/Payment.js";
// Get all payment
export const getAllPayments = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  try {
    const payments = await Payment.find()
      .skip((page - 1) * limit) // Skip documents for previous pages
      .limit(parseInt(limit)); // Limit the number of documents;;

    res.status(200).json({
      length: payments.length,
      page,
      limit,
      payments,
    });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

// Get a payment by Id
export const getPaymentById = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const payment = await Payment.findById({ _id: paymentId });

    if (!payment) return res.status(404).json({ Message: "Payment not found" });

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

// Create a payment
export const createPayment = async (req, res) => {
  try {
    const newPayment = new Payment(req.body);

    const savedPayment = await newPayment.save();
    res.status(200).json({
      Message: "payment created successfully",
      payment: savedPayment,
    });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

// Update a payment by Id
export const updatePayment = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const paymentExist = await Payment.findById(paymentId);
    if (!paymentExist)
      return res.status(404).json({ Error: "payment not found" });

    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({
      Message: "payment updated successfully",
      payment: updatedPayment,
    });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

// Delete a payment by Id
export const deletePayment = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const payment = await Payment.findByIdAndDelete(paymentId);
    if (!payment) return res.status(404).json({ Message: "payment not found" });
    res.status(200).json({
      Message: "payment removed successfully",
      deletedPayment: payment,
    });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};
