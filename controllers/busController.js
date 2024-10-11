const busModel = require("../models/busModel");
const routeModel = require("../models/routeModel");
const moment = require('moment'); // Ensure moment.js is installed
const { getNextSequence } = require('../models/counter');

exports.searchBusController = async (req, res) => {
    try {
        const { source, destination, date, type } = req.body;
        console.log(req.body)
        // Validate input
        if (!source || !destination || !date || !type) {
            return res.status(400).send({
                success: false,
                message: "Please fill all fields",
            });
        }
        const selectedDay = moment(date).format('ddd'); // e.g., "Tue"
        console.log(selectedDay)
        // Step 1: Find routes that match source and destination
        const routes = await routeModel.find({
            $or: [
                {
                    source: source,
                    destination: destination
                },
                {
                    stops: { $all: [source, destination] }, // Both must be stops
                    $expr: {
                        $lt: [ // Ensure source comes before destination
                            { $indexOfArray: ["$stops", source] },
                            { $indexOfArray: ["$stops", destination] }
                        ]
                    }
                }
            ]
        });


        console.log("Source:", source);
        console.log("Destination:", destination);
        console.log("Routes found:", routes);
        // If no routes are found, return an empty result
        if (routes.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
            });
        }

        // Step 2: Extract route IDs
        const routeIds = routes.map(route => route._id); // Use _id for ObjectId
        // console.log('Route IDs:', routeIds); // Check the route IDs being used

        // Step 3: Find buses based on route IDs, type
        const buses = await busModel.find({
            route: { $in: routeIds },
            type,
            days: selectedDay // Check if the bus operates on the selected day

        }).populate('route');  // This populates the route field with full route details

        // Return the buses
        res.status(200).send({
            success: true,
            data: buses
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Error in Getting Buses",
            success: false,
            error
        });
    }
}

exports.addBusController = async (req, res) => {
    try {
        const { capacity, days, type, route, departureTime, arrivalTime, fare, status } = req.body;

        // Generate the next bus ID
        const busId = await getNextSequence('busId'); // Generate the next bus ID
        const newBusId = `B${busId}`; // Prefix with 'B'

        // Validation
        if (!capacity || !days || !type || !departureTime || !arrivalTime || !status || !fare) {
            return res.status(400).send({
                success: false,
                message: "Please fill all fields",
            });
        }

        // Check for existing bus (optional, depending on your requirements)
        const existingBus = await busModel.findOne({ busId: newBusId });
        if (existingBus) {
            return res.status(400).send({
                success: false,
                message: "Bus with the same ID already exists",
            });
        }

        // Save new bus
        const bus = new busModel({
            busId: newBusId,
            capacity,
            days,
            type,
            route,
            departureTime,
            arrivalTime,
            fare,
            seatsAvailable: capacity,
            status,
        });
        await bus.save();

        return res.status(200).send({
            success: true,
            message: "New Bus Added",
            bus
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Error in Add Bus Callback",
            success: false,
            error
        });
    }
};

//get All Buses
exports.getAllBuses = async (req, res) => {
    try {
        const buses = await busModel.find({}).populate("route");

        if (!buses) {
            return res.status(200).send({
                success: false,
                message: "No Buses Found"
            });
        }
        return res.status(200).send({
            busCount: buses.length,
            success: true,
            message: "All Buses",
            buses
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Error in Getting all Buses",
            success: false,
            error
        });
    }
};

// Update Bus
exports.updateBus = async (req, res) => {
    try {
        const { busId } = req.params;
        const updatedBus = await busModel.findByIdAndUpdate(busId, req.body, {
            new: true,
        }).populate("route");

        if (!updatedBus) {
            return res.status(404).send({
                success: false,
                message: "Bus not found",
            });
        }

        return res.status(200).send({
            success: true,
            message: "Bus updated successfully",
            updatedBus,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Error in updating the bus",
            success: false,
            error,
        });
    }
};

// Get Bus by ID
exports.getBusById = async (req, res) => {
    try {
        const { busId } = req.params;
        const bus = await busModel.findById(busId).populate("route");

        if (!bus) {
            return res.status(404).send({
                success: false,
                message: "Bus not found",
            });
        }

        return res.status(200).send({
            success: true,
            message: "Bus retrieved successfully",
            bus,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Error in fetching the bus details",
            success: false,
            error,
        });
    }
};

// Delete Bus
exports.deleteBus = async (req, res) => {
    try {
        const { busId } = req.params;
        const deletedBus = await busModel.findByIdAndDelete(busId);

        if (!deletedBus) {
            return res.status(404).send({
                success: false,
                message: "Bus not found",
            });
        }

        return res.status(200).send({
            success: true,
            message: "Bus deleted successfully",
            deletedBus,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Error in deleting the bus",
            success: false,
            error,
        });
    }
};

// Get Bus Schedule by Bus ID
exports.getBusSchedule = async (req, res) => {
    const { busId } = req.params;

    try {
        const bus = await busModel.findOne({ busId }).populate('route');

        if (!bus) {
            return res.status(404).send({ success: false, message: "Bus not found" });
        }

        res.status(200).send({
            success: true,
            message: "Bus Schedule retrieved successfully",
            bus,

        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Error in reyrieving the bus schedule",
            success: false,
            error,
        });

    }
};