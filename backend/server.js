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
const otpRoute = require("./src/v1/routes/otp");
app.use("/otp", otpRoute);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
