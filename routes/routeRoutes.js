const express = require("express");
const { addRouteController, getAllRoutes, updateRoute, deleteRoute, getRouteById } = require("../controllers/routeController");

//routes object
const router = express.Router();

router.post("/admin/add-route",addRouteController)
router.get("/admin/all-routes",getAllRoutes)
router.put('/admin/edit-route/:routeId', updateRoute);

// Delete bus by ID
router.delete('/admin/delete/:routeId', deleteRoute);

// Get bus by ID
router.get('/admin/:routeId', getRouteById);

module.exports = router;
