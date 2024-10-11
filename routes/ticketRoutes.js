const express = require("express");
const { makePayment, verifyPayment, saveTicket, getBookingsByEmail, getTicketById, cancelTicket, getAllTickets } = require('../controllers/ticketController');
const router = express.Router();

// Route to create a new ticket
router.post('/payment', makePayment);
router.post('/verify', verifyPayment);
router.post('/save', saveTicket);
router.get('/my-bookings/:userId', getBookingsByEmail); // Add this route
router.get('/:ticketId', getTicketById);
router.delete('/cancel/:ticketId', cancelTicket);
router.get('/admin/all-bookings', getAllTickets); // Example endpoint for getting all tickets

module.exports = router;
