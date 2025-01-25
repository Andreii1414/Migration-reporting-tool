require("dotenv").config();
const express = require("express");
const ApiResponse = require("./src/responses/apiResponse");
const {
  WelcomeMessage,
  StatusCodes,
  EndpointNotFound,
} = require("./src/responses/apiConstants");
const passportConfig = require("./src/config/passportConfig");
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const conversationRoutes = require("./src/routes/conversationRoutes");
const appointmentRoutes = require("./src/routes/appointmentRoutes");
const staticRoutes = require("./src/routes/staticRoutes");
const reportRoutes = require("./src/routes/reportRoutes");
const speciesRoutes = require("./src/routes/speciesRoutes");

const app = express();
const cors = require("cors");

app.use(cors());

//middlewares
app.use(express.json());
app.use(express.static("./src/public"));
app.use(passportConfig.initialize());

//routes
app.get("/", (req, res) => {
  ApiResponse.success(res, { data: { message: WelcomeMessage } });
});
app.get("/ping", (req, res) => {
  res.status(200).send();
});
app.use("/api/auth", authRoutes);
app.use("/api/profile", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/species", speciesRoutes);

app.use("/static", staticRoutes);

// this middleware will be executed if no route is matched
app.use((req, res) => {
  ApiResponse.error(res, {
    statusCode: StatusCodes.NotFound,
    error: EndpointNotFound,
  });
});

module.exports = app;
