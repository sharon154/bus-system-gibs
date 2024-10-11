const ticketModel = require('../models/ticketModel'); 
const busModel = require("../models/busModel");

const crypto = require('crypto');

const { Cashfree } = require('cashfree-pg')

Cashfree.XClientId = process.env.CLIENT_ID;
Cashfree.XClientSecret = process.env.CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;;

function generateOrderId(){
  const uniqueId = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256');
  hash.update(uniqueId);
  const ticketId = hash.digest('hex');
  return ticketId.substr(0,12);
}
exports.makePayment = async (req, res) => {
  try {
    console.log("Make payment initiated"); // Log that payment process started
    const { totalFare, passengerNames, email, phone } = req.body; // Destructure payment data from the request body

    // Generate a unique order ID
    const ticketId = await generateOrderId();

    // Ensure passengerNames is an array and join it to create a string
    const customerName = Array.isArray(passengerNames) ? passengerNames.join(", ") : passengerNames || "Unknown";

   
    let request = {
      "order_amount": totalFare, // Use the total fare from the request body
      "order_currency": "INR",
      "order_id": ticketId,
      "customer_details": {
        "customer_id": ticketId, // Use orderId or a unique ID here
        "customer_name": customerName, // Pass the array of passenger names directly
        "customer_email": email, // Use email from the request body
        "customer_phone": phone, // Use phone from the request body
      }
    }
    
  Cashfree.PGCreateOrder("2023-08-01",request).then(response => {
    console.log(response.data);
    res.json(response.data)
  }).catch(error => {
    console.log(error.response.data.message);
  })

  }catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in Initiating Payment",
      success: false,
      error
    });
  }
}

exports.verifyPayment = async (req, res) => {
  try {
    let { ticketId } = req.body;
    console.log("Verifying payment for ticketId:", ticketId);

    Cashfree.PGOrderFetchPayments("2023-08-01",ticketId).then(response => {
      console.log(response.data);
      res.json(response.data)
    }).catch(error => {
      console.log(error.response.data.message);
    })
  
  }catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in Payment Verification",
      success: false,
      error
    });
  }
}

exports.saveTicket = async (req, res) => {
  try {
    const { ticketId, busId, source, destination, type, totalFare, journeyDate, passengerNames, ages, email, phone, paymentStatus } = req.body;
    const bus = await busModel.findOne({ busId });

    // Check if the bus exists
    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found.' });
    }

    // Check if there are enough seats available
    if (bus.seatsAvailable <= 0) {
      return res.status(400).json({ success: false, message: 'No seats available for booking.' });
    }

    // Decrement the available seats by the number of passengers
    const passengersCount = passengerNames.length; // Assuming you are sending an array of passenger names
    if (bus.seatsAvailable < passengersCount) {
      return res.status(400).json({ success: false, message: 'Not enough seats available for the number of passengers.' });
    }

    bus.seatsAvailable -= passengersCount; // Decrement the seats available

    // Save the updated bus information
    await bus.save();
    // Create a new ticket instance
    const newTicket = new ticketModel({
      ticketId,
      busId,
      source,
      destination,
      type,
      totalFare,
      journeyDate,
      passengerNames,
      ages,
      email,
      phone,
      paymentStatus,
    });

    // Save the ticket to the database
    await newTicket.save();

    res.status(200).json({ success: true, message: 'Ticket saved successfully', ticket: newTicket });
  } catch (error) {
    console.error('Error saving ticket:', error);
    res.status(500).json({ success: false, message: 'Error saving ticket', error: error.message });
  }
}


// Get Bookings by Email
exports.getBookingsByEmail = async (req, res) => {
  const { userId  } = req.params; // Assuming email is sent as a URL parameter

  try {
    const bookings = await ticketModel.find({ email: userId }); // Find all tickets associated with the given email
    if (!bookings.length) {
      return res.status(404).json({ success: false, message: 'No bookings found for this email.' });
    }

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, message: 'Error fetching bookings', error: error.message });
  }
};

exports.getTicketById = async (req, res) => {
  const { ticketId } = req.params;

  try {
    const ticket = await ticketModel.findOne({ ticketId }); // Assuming ticketId is a unique field in the Ticket model

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json({ success: true, ticket });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.cancelTicket = async (req, res) => {
  const { ticketId } = req.params; // Get ticket ID from request parameters

  try {
    // Find the ticket by ID
    const ticket = await ticketModel.findOne({ ticketId: ticketId });
    
    // Check if the ticket exists
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    const journeyDate = new Date(ticket.journeyDate);
    const currentDate = new Date();
    const hoursUntilJourney = Math.abs(journeyDate - currentDate) / 36e5; // Calculate the hours until the journey

    // Check if there are 24 hours or more left for the journey
    if (hoursUntilJourney < 24) {
      return res.status(400).json({ message: 'You can only cancel tickets with at least 24 hours remaining.' });
    }

    // Calculate the refund based on how early the ticket is canceled
    let refundAmount;
    if (hoursUntilJourney >= 48) {
      refundAmount = ticket.totalFare * 0.80; // 90% refund if canceled more than 48 hours in advance (10% charge)
    } else if (hoursUntilJourney >= 24) {
      refundAmount = ticket.totalFare * 0.70; // 80% refund if canceled within 24-48 hours (20% charge)
    } else {
      refundAmount = 0; // No refund if less than 24 hours
    }

    // Cancel the ticket (update the ticket status)
    ticket.paymentStatus = 'Cancelled';
    await ticket.save();

    // Increment available seats for the associated bus
    const bus = await busModel.findOne({ busId: ticket.busId }); // Assuming ticket has busId
    if (bus) {
      bus.seatsAvailable += 1; // Increment available seats by 1
      await bus.save(); // Save the updated bus
    }

    // Return response with refund amount
    return res.status(200).json({ 
      message: 'Ticket cancelled successfully.', 
      refundAmount: refundAmount > 0 ? `Rs.${refundAmount}` : 'No refund applicable.' 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await ticketModel.find({}); // Fetch all tickets from the database

    if (!tickets || tickets.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No Tickets Found"
      });
    }

    return res.status(200).send({
      ticketCount: tickets.length,
      success: true,
      message: "All Tickets Retrieved Successfully",
      tickets
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in Getting all Tickets",
      success: false,
      error
    });
  }
};