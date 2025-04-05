import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import mongoose from "mongoose";

// Apollo Server
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

// GraphQL schema and resolvers
import typeDefs from "./src/graphql/schema.js";
import resolvers from "./src/graphql/resolvers.js";

// REST Routes
import v1_ChatRoutes from "./src/v1/routes/chatRoutes.js";
import v1_downloadRoutes from "./src/v1/routes/downloadRoutes.js";
import v1_OtpRoute from "./src/v1/routes/otpRoutes.js";
import v1_UserRoute from "./src/v1/routes/userRoutes.js"

// Swagger Docs
import { swaggerDocs as V1SwaggerDocs } from "./src/v1/swagger.js";

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
app.use("/api/v1/chat", v1_ChatRoutes);
app.use("/api/v1/download", v1_downloadRoutes);
app.use("/api/v1/otps", v1_OtpRoute);
app.use("/api/v1/users", v1_UserRoute)

// Create separate Mongoose connections
const brownDustDb = mongoose.createConnection(process.env.ATLAS_URI_BROWNDUST);
brownDustDb.once("open", () => console.log("✅ MongoDB BrownDust connected"));
brownDustDb.on("error", (err) => console.error("❌ MongoDB BrownDust error:", err));

const portfolioDb = mongoose.createConnection(process.env.ATLAS_URI_PORTFOLIO);
portfolioDb.once("open", () => console.log("✅ MongoDB Portfolio connected"));
portfolioDb.on("error", (err) => console.error("❌ MongoDB Portfolio error:", err));

// Setup Apollo Server with Express
async function startApolloServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins:[
            ApolloServerPluginDrainHttpServer({ httpServer })
        ],
    });
    await server.start();

    // Mount GraphQL middleware at /graphql
    app.use(
        "/graphql",
        cors(),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req }) => ({ req }),
        })
    );
}

await startApolloServer();

const port = process.env.PORT || 3001;
httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
    V1SwaggerDocs(app, port)
});

// Export these if models use specific connections
export {
    brownDustDb,
    portfolioDb
};

