const mongoose = require("mongoose")

const busSchema = new mongoose.Schema({
    busId: {
        type: String,
        required: [true, 'Bus ID is required']
    },
    capacity: {
        type: Number,
        required: [true, 'Capacity of bus is required']
      },
    days: {
        type: [String],
        enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        required: [true, 'Days on which the bus runs are required']
    },
    type: {
        type: String,
        required: [true, 'Type of bus is required']
    },
    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: [true, 'Route is required']
    },
    departureTime: {
        type: String, // Store time as a string in 'HH:mm' format
        required: [true, 'Departure Time is required']
    },
    arrivalTime: {
        type: String, // Store time as a string in 'HH:mm' format
        required: [true, 'Arrival time is required']
    },
    fare: { // New fare field
        type: Number,
        required: true
    },
    seatsAvailable: {
        type: Number,
        // required: true
    },
    status: {
        type: String,
        enum: ['Running', 'Maintenance', 'Inactive'],
        default: 'Running',
    },
}, { timestamps: true });
const busModel = mongoose.model("Bus", busSchema);

module.exports = busModel;