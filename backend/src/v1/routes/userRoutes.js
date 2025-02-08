const express = require("express");
const userController = require("../../controllers/userController")

const router = express.Router();

router.get("/", async(req, res) => {
    res.send("user is running!");
})

router.get("/:phoneNumber", userController.getOneUser);

module.exports = router;
