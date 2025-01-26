require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const cron = require("node-cron");
const fetch = require("node-fetch");
const { sendReportsToGraphDB, clearGraphDB } = require("./src/services/internal/graphdbService.js");

const PORT = process.env.PORT;
const HOST = process.env.HOST;
const MONGODB_URI = process.env.MONGODB_URI;

cron.schedule("0 0 * * *", async () => {
  console.log("Calling API at midnight...");
  try {
    const response = await fetch("http://localhost:5000/api/data");
    if (!response.ok) throw new Error("Request failed");
    await clearGraphDB();
    await sendReportsToGraphDB();
    const data = await response.json();
    //console.log("API Response:", data);
  } catch (error) {
    console.error("Error calling API:", error);
  }
});


const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

  } catch (err) {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  }

  try {
    app.listen(PORT, HOST, () => {
      console.log(`Server is running on http://${HOST}:${PORT}`);
    });

    await clearGraphDB();
    await sendReportsToGraphDB();

  }
  catch (err) {
    console.error("Error starting server", err);
    process.exit(1);
  }
};

startServer();
