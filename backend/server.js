require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT;
const HOST = process.env.HOST;
const MONGODB_URI = process.env.MONGODB_URI;

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
  }
  catch (err) {
    console.error("Error starting server", err);
    process.exit(1);
  }
};

startServer();
