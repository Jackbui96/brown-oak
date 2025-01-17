const express = require("express");

const router = express.Router();

const User = require("../models/User")

router.get("/", async(req, res) => {
    res.send("user is running!");
})

router.get("/get-user/:phoneNumber", async (req, res, next) => {
    try {
        const user = await User.findOne(req.params.phoneNumber);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.json(user);
    } catch (err) {
        res.status(500).send("Error retrieving user");
    }
})

module.exports = router;