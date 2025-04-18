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
import v1_resumeRoute from "./v1/routes/resumeRoute.js";

// Swagger Docs
import { swaggerDocs as V1SwaggerDocs } from "./v1/swagger.js";
import { loadConfigFromSSM } from "./utils/loadConfig.js";

const app = express();
const httpServer = http.createServer(app);

await loadConfigFromSSM([
    "databases",
]);

// Middlewares
app.use(cors());
app.use(express.json());

// REST endpoint for health-check
app.get("/", (req, res) => {
    res.send("Backend is running!");
})

// REST routes
app.use("/v1/resume", v1_resumeRoute);

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

const docstorePort = 5006;
httpServer.listen(docstorePort, () => {
    console.log(`Server running on port ${docstorePort}`);
    V1SwaggerDocs(app, docstorePort)
});
