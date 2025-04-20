import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json' assert { type: "json" };

const app = express();

// 🌐 Middleware
app.use(cors());
app.use(bodyParser.json());

// 🩺 Health Check
app.get('/health', (req, res) => {
    res.status(200).send('API Gateway is up and running!');
});

// 📘 Swagger UI
app.use('/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 404 Fallback
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// 🚀 Start server
const swaggerPort = 9999;
app.listen(swaggerPort, () => {
    console.log(`API Gateway running on port ${swaggerPort}`);
});
