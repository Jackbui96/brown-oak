const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(process.env.ATLAS_URI)
        .then(() => console.log("MongoDB connected!"))
        .catch((err) => console.error("Failed to connect to MongoDB", err));
};

module.exports = connectDB;
