import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";

// REST Routes
import v1_resumeRoute from "./v1/routes/resumeRoute.js";

const app = express();
const httpServer = http.createServer(app);

// Middlewares
app.use(cors());
app.use(express.json());

// REST endpoint for health-check
app.get("/", (req, res) => {
    res.send("Backend is running!");
})

// REST routes
app.use("/v1/resume", v1_resumeRoute);

const docstorePort = 5006;
httpServer.listen(docstorePort, () => {
    console.log(`Server running on port ${docstorePort}`);
});
