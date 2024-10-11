const mongoose = require('mongoose');

// Define the ticket schema
const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true }, // String for ticketId
  busId: { type: String, required: true }, // Use String for busId
  source: { type: String, required: true },
  destination: { type: String, required: true },
  type: { type: String, required: true },
  totalFare: { type: Number, required: true },
  journeyDate: { type: Date, required: true },
  bookingDate: { type: Date, default: Date.now }, // Date for the booking date
  passengerNames: { type: [String], required: true }, // Array of strings
  ages: { type: [Number], required: true }, // Array of numbers
  email: { type: String, required: true }, // String for email
  phone: { type: String, required: true },
  paymentStatus: { type: String, required: true },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Create the Ticket model
const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
