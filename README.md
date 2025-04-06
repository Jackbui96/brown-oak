# 🧠 API Server — api.a-pani.com

This is a production-ready backend server powering portfolio features, live chat, OTP authentication, and resume tracking.

## 🚀 Tech Stack

- **Node.js** with ES Modules
- **Express.js** for REST APIs
- **Apollo GraphQL** for schema-driven data access
- **MongoDB** with Mongoose and multiple database connections
- **AWS S3** (signed resume downloads via IAM role)
- **Swagger** for REST documentation
- **PM2** for process management
- **dotenv**, **body-parser**, **CORS**, and **Twilio** for infrastructure and communication

## 📂 Project Structure

```
src/
├── graphql/
├── models/
├── services/
├── controllers/
├── databases/
├── v1/routes/
└── v1/swagger.js
```

## 🔧 REST Endpoints

- `GET /v1/download/resume` – Generate a signed resume download URL and log the request
- `POST /v1/chat/chatRequest` – Communicate with Gemini API to respond to user input
- `POST /v1/otps` – OTP generation and verification (via Twilio)
- `GET /v1/docs` – Swagger documentation

## 🔮 GraphQL

- Endpoint: `/graphql`
- Queries: `downloads`, `downloadCount`
- Mutations: `recordResumeDownload`

## 📜 Setup (Local)

```bash
# Install dependencies
npm install

# Run the server
npm run server
```

## 📜 Setup (Server)

```bash
# Install dependencies
npm install

# PM2 Setup
pm2 start npm --name "api.a-pani" -- run server

# PM2 Restart
pm2 restart api.a-pani
```

## 🌱 Environment Variables

```env
PORT=5000
ATLAS_URI_PORTFOLIO
ATLAS_URI_BROWNOAK
AWS_REGION
AWS_S3_BUCKET
GEMINI_KEY
```

## 📘 Swagger Docs

Once the server is up, visit: [http://localhost:5000/v1/docs](http://localhost:5000/v1/docs)
