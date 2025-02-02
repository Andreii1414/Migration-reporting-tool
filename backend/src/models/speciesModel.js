const mongoose = require("mongoose");

const speciesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [1, "Name must be at least 1 character long"],
      maxlength: [100, "Name can be no more than 100 characters long"],
    },
  },
  {
    collection: "species",
    timestamps: true,
  }
);

const Species = mongoose.model("Species", speciesSchema);

module.exports = Species;
