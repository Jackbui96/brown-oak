import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";

// MongoDB Server
import { initDatabaseConnections } from "./databases/index.js";

// Apollo Server
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

// GraphQL schema and resolvers
import typeDefs from "./graphql/schema.js";
import resolvers from "./graphql/resolvers.js";

// REST Routes
import v1_OtpRoute from "./v1/routes/otpRoutes.js";
import v1_UserRoute from "./v1/routes/userRoutes.js"

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
app.use("/v1/otps", v1_OtpRoute);
app.use("/v1/users", v1_UserRoute);

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

await initDatabaseConnections();
await startApolloServer();

const port = process.env.PORT || 3001;
httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
    V1SwaggerDocs(app, port)
});
