const User = require('../models/userModel'); // Adjust the path as necessary
const Bus = require('../models/busModel');
const Route = require('../models/routeModel');
const Booking = require('../models/ticketModel');
const Feedback = require('../models/feedbackModel');

// Controller function to get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments(); // Count users
    const busCount = await Bus.countDocuments(); // Count buses
    const routeCount = await Route.countDocuments(); // Count routes
    const bookingCount = await Booking.countDocuments(); // Count bookings
    const feedbackCount = await Feedback.countDocuments(); // Count feedbacks

    return res.status(200).json({
      users: userCount,
      buses: busCount,
      routes: routeCount,
      bookings: bookingCount,
      feedbacks: feedbackCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
