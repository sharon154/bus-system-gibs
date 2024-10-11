const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardController'); // Import the controller
const router = express.Router();

// Define the route for dashboard stats
router.get('/admin/dashboard', getDashboardStats);

module.exports = router;
