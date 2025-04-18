import express from "express";
import cors from "cors";
import http from "http";

// REST Routes
import v1_configRoutes from "./v1/routes/configRoutes.js";

// Swagger Docs
import { swaggerDocs as V1SwaggerDocs } from "./v1/swagger.js";

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
app.use("/v1/config", v1_configRoutes);

const configPort = 5007;
httpServer.listen(configPort, () => {
    console.log(`Server running on port ${configPort}`);
    V1SwaggerDocs(app, configPort)
});
