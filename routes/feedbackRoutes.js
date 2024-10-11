const express = require("express");
const {
  getFeedbacks,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedbackById
} = require("../controllers/feedbackController");

const router = express.Router();

// Feedback routes
router.get("/admin/all-feedbacks", getFeedbacks);           // Get all feedbacks
router.post("/", createFeedback);        // Create new feedback
router.put("/:id", updateFeedback);      // Update feedback by ID
router.delete("/:id", deleteFeedback);   // Delete feedback by ID
router.get("/:id",getFeedbackById)
module.exports = router;
