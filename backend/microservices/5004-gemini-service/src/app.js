import { loadConfigFromSSM } from "./utils/loadConfig.js";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";

// REST Routes
import v1_ChatRoutes from "./v1/routes/chatRoutes.js";

// Swagger Docs
import { swaggerDocs as V1SwaggerDocs } from "./v1/swagger.js";

await loadConfigFromSSM([
    "keys/gemini",
]);

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
app.use("/v1/gemini", v1_ChatRoutes);

app.use(
    cors(),
    bodyParser.json(),
);

const geminiPort = 5004;
httpServer.listen(geminiPort, () => {
    console.log(`Server running on port ${geminiPort}`);
    V1SwaggerDocs(app, geminiPort)
});
