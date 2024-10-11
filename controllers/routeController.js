const routeModel = require("../models/routeModel")
const { getNextSequence } = require('../models/counter');

exports.addRouteController = async (req, res) => {
    try {
        const { source, destination, distance, estimatedTime, stops } = req.body;
        // console.log(req.body); 
        const routeId = await getNextSequence('routeId'); // Generate the next bus ID
        const newRouteId = `R${routeId}`; // Prefix with 'B'

        // Validation
        if ( !source || !destination || !distance || !estimatedTime || !stops) {
            return res.status(401).send({
                success: false,
                message: "Please fill all fields",
            });
        }
        // console.log('Received bus data:', req.body);

        // Check for existing route (optional, depending on your requirements)
        const existingRoute = await routeModel.findOne({ routeId: newRouteId });
        if (existingRoute) {
            return res.status(401).send({
                success: false,
                message: "Route with the same id already exists",
            });
        }

        // Save new route
        const route = new routeModel({
            routeId: newRouteId,
            source,
            destination,
            distance,
            estimatedTime,
            stops,
        });
        await route.save();
        return res.status(200).send({
            success: true,
            message: "New Route Added",
            route
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Error in Add Route Callback",
            success: false,
            error
        });
    }
};

//get All Routes
exports.getAllRoutes = async (req, res) => {
    try {
      const routes = await routeModel.find({});
  
      if (!routes) {
        return res.status(200).send({
          success: false,
          message: "No Routes Found"
        });
      }
      return res.status(200).send({
        routeCount: routes.length,
        success: true,
        message: "All Routes",
        routes
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Error in Getting all Routes",
        success: false,
        error
      });
    }
  };
  
  // Update Route
exports.updateRoute = async (req, res) => {
  try {
      const { routeId } = req.params;
      const updatedRoute = await routeModel.findByIdAndUpdate(routeId, req.body, {
          new: true,
      })

      if (!updatedRoute) {
          return res.status(404).send({
              success: false,
              message: "Route not found",
          });
      }

      return res.status(200).send({
          success: true,
          message: "Route updated successfully",
          updatedRoute,
      });
  } catch (error) {
      console.log(error);
      return res.status(500).send({
          message: "Error in updating the route",
          success: false,
          error,
      });
  }
};

// Get Route by ID
exports.getRouteById = async (req, res) => {
  try {
      const { routeId } = req.params;
      const route = await routeModel.findById(routeId)

      if (!route) {
          return res.status(404).send({
              success: false,
              message: "Route not found",
          });
      }

      return res.status(200).send({
          success: true,
          message: "Route retrieved successfully",
          route,
      });
  } catch (error) {
      console.log(error);
      return res.status(500).send({
          message: "Error in fetching the route details",
          success: false,
          error,
      });
  }
};

// Delete Route
exports.deleteRoute = async (req, res) => {
  try {
      const { routeId } = req.params;
      const deletedRoute = await routeModel.findByIdAndDelete(routeId);

      if (!deletedRoute) {
          return res.status(404).send({
              success: false,
              message: "Route not found",
          });
      }

      return res.status(200).send({
          success: true,
          message: "Route deleted successfully",
          deletedRoute,
      });
  } catch (error) {
      console.log(error);
      return res.status(500).send({
          message: "Error in deleting the route",
          success: false,
          error,
      });
  }
};
