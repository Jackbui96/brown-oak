require("dotenv").config({ path: "./.env" })
const express = require('express');
const session = require('express-session');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

app.get("/", (req, res) => {
    res.send("Backend is running!");
})

// Routes
const v1_OtpRoute = require("./src/v1/routes/otpRoutes");
app.use("/api/v1/otps", v1_OtpRoute);

// DB
const connectDB = require("./config/db")
connectDB()

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
