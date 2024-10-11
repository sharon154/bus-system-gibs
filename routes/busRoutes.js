const express = require("express");
const {
    searchBusController, addBusController, getAllBuses, updateBus, deleteBus, getBusById, getBusSchedule
} = require("../controllers/busController");
const { requireSignIn, isAdmin } = require("../middlewares/auth");

//routes object
const router = express.Router();

//CREATE USER || POST
router.post("/bus-list", searchBusController);

router.post("/admin/add-bus", addBusController);

router.get("/admin/all-buses",getAllBuses)

// Edit bus by ID
router.put('/admin/edit-bus/:busId', updateBus);

// Delete bus by ID
router.delete('/admin/delete/:busId', deleteBus);

// Get bus by ID
router.get('/admin/:busId', getBusById);

router.get("/schedule/:busId", getBusSchedule); // Add this line

module.exports = router;
