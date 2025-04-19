import express from "express";
import { handleGetOneUser } from "../../../controllers/traffic-monitor/userController.js";

const router = express.Router();

router.get("/", async(req, res) => {
    res.send("user is running!");
})

router.get("/:phoneNumber", handleGetOneUser);

export default router;
