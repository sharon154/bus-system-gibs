const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    feedbackId: {
        type: String,
        required: [true, 'Feedback ID is required']
    },
    text: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
      type: String,
      required: true, // Email of the user submitting the feedback
      lowercase: true, // Convert to lowercase
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set to the current date when created
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;






