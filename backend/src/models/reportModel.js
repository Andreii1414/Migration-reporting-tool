const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [false],
        },
        title: {
        type: String,
        required: [true, "Title is required"],
        default: "Untitled",
        trim: true,
        minlength: [1, "Title must be at least 1 character long"],
        maxlength: [100, "Title can be no more than 100 characters long"],
        },
        description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
        minlength: [1, "Description must be at least 1 character long"],
        maxlength: [500, "Description can be no more than 500 characters long"],
        },
        date: {
        type: Date,
        required: [true, "Date is required"],
        },
        speciesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Species",
        required: [true, "Species ID is required"],
        },
        imageUrl: {
        type: String,
        required: [true, "Image URL is required"],
        trim: true,
        },
        latitude: {
        type: Number,
        required: [true, "Latitude is required"],
        },
        longitude: {
        type: Number,
        required: [true, "Longitude is required"],
        },
    },
    {
        collection: "reports",
        timestamps: true,
    }
    );

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;