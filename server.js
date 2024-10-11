const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

//dotenv configure
dotenv.config();

//router import
const userRoutes = require("./routes/userRoutes");
const busRoutes = require("./routes/busRoutes")
const routeRoutes = require("./routes/routeRoutes")
const ticketRoutes = require("./routes/ticketRoutes"); 
const feedbackRoutes = require("./routes/feedbackRoutes"); 
const dashboardRoutes = require("./routes/dashboardRoutes"); 

//mongodb connection (it should be after dotenv configuration)
connectDB();

//rest object
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
/*
app.get("/", (req, res) => {
  res.status(200).send({
    message: "Node server",
  });
});
*/
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/bus", busRoutes);
app.use("/api/v1/route", routeRoutes);
app.use("/api/v1/ticket", ticketRoutes);
app.use("/api/v1/feedbacks", feedbackRoutes);
app.use("/api/v1/stats", dashboardRoutes);

//app.use("/api/v1/blog", blogRoutes);


//Port
const PORT = process.env.PORT || 1000;
const DEV_MODE = process.env.DEV_MODE;
//listen
app.listen(1000, () => {
  console.log(
    `Server running in ${DEV_MODE} mode on port ${PORT}`.bgYellow.white
  );
});
