const Feedback = require("../models/feedbackModel");
const { getNextSequence } = require('../models/counter');

// Get all feedbacks
exports.getFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({}).populate("user");
    
        if (!feedbacks) {
          return res.status(200).send({
            success: false,
            message: "No Feedbacks Found"
          });
        }
        return res.status(200).send({
            feedbackCount: feedbacks.length,
          success: true,
          message: "All feedbacks",
          feedbacks
        });
      } catch (error) {
        console.log(error);
        return res.status(500).send({
          message: "Error in Getting all feedbacks",
          success: false,
          error
        });
      }
    };
    

// Create new feedback
exports.createFeedback = async (req, res) => {
    try {
        const { text, name, email } = req.body; // Get the username and email from the request body
        const feedbackId = await getNextSequence('feedbackId'); // Generate the next bus ID
        const newFeedbackId = `F${feedbackId}`; // Prefix with 'B'

        if (!text || !name) {
            return res.status(400).json({ message: "Text and name are required fields." });
        }

        const newFeedback = new Feedback({ feedbackId: newFeedbackId, text, name, email });
        const savedFeedback = await newFeedback.save();
        res.status(201).json(savedFeedback);
    } catch (error) {
        console.error("Error creating feedback:", error);
        res.status(500).json({ message: "Server error. Could not create feedback." });
    }
};

// Update feedback by ID
exports.updateFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const { text, name } = req.body;

        if (!text || !name) {
            return res.status(400).json({ message: "Text and name are required fields." });
        }

        const feedback = await Feedback.findByIdAndUpdate(id, { text, name }, { new: true });

        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found." });
        }

        res.status(200).json(feedback);
    } catch (error) {
        console.error("Error updating feedback:", error);
        res.status(500).json({ message: "Server error. Could not update feedback." });
    }
};

// Delete feedback by ID
exports.deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findByIdAndDelete(id);

        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found." });
        }

        res.status(200).json({ message: "Feedback deleted successfully." });
    } catch (error) {
        console.error("Error deleting feedback:", error);
        res.status(500).json({ message: "Server error. Could not delete feedback." });
    }
};
// Get feedback by ID
exports.getFeedbackById = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findById(id);

        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found." });
        }

        res.status(200).json(feedback);
    } catch (error) {
        console.error("Error fetching feedback by ID:", error);
        res.status(500).json({ message: "Server error. Could not fetch feedback." });
    }
};
