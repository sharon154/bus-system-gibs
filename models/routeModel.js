const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
    routeId:{
        type:String,
        required:[true, 'RouteId is required']
    },
    source: {
        type: String,
        required: [true, 'Source location is required']
    },
    destination: {
        type: String,
        required: [true, 'Destination location is required']
    },
    distance: {
        type: Number,
        required: [true, 'Distance between source and destination is required']
    },
    estimatedTime: {
        type: String,
        required: [true, 'Estimated travel time is required']
    },
    stops: {
        type: [String], // Array of stop names
        default: []
    },
}, { timestamps: true });

const routeModel = mongoose.model("Route", routeSchema);

module.exports = routeModel;
