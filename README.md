# 🧠 Brown Oak API — [api.a-pani.com](https://api.a-pani.com)

![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-informational)
![GraphQL](https://img.shields.io/badge/API-GraphQL-purple)
![Deployed](https://img.shields.io/badge/Deployed-Yes-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

Brown Oak is a **production-ready microservice backend** powering a full-stack developer portfolio, AI-powered live chat, OTP-authenticated login, and resume tracking — all served via a unified gateway at [api.a-pani.com](https://api.a-pani.com).

---

## 🚀 Tech Stack

- **Node.js** with ES Modules
- **Express.js** for REST APIs
- **Apollo GraphQL** for schema-driven access
- **MongoDB** via Mongoose with multiple database connections
- **AWS S3** for signed resume downloads (IAM integration)
- **Twilio** for OTP messaging
- **PM2** for process management
- **Swagger UI** for REST API documentation
- **dotenv**, **CORS**, **body-parser** for infra support

---

## 🗺 Architecture Overview

![Brown Oak Architecture](.\assets\brown-oak-architecture.svg)

---

## 📂 Project Structure

```
brown-oak/
├── microservices/
│   ├── 5003-user-service/
│   ├── 5004-gemini-service/
│   ├── 5005-web-tracking-service/
│   ├── 5006-docstore-service/
│   └── 5007-config-service/
├── ecosystem.config.js
└── README.md
```

---

## 🔧 REST Endpoints

| Method | Endpoint                        | Description                                    |
|--------|---------------------------------|------------------------------------------------|
| POST   | `/v1/moodie/auth/google-signin` | Firebase powered signin for Moodie Application |
| POST   | `/v1/traffic-monitor/auth/otp`  | Generate/verify OTP via Twilio                 |
| POST   | `/v1/gemini/chat`               | Send prompt to Gemini and get reply            |
| GET    | `/v1/resume`                    | Generate signed S3 resume URL                  |

_...and many more_

## 🌐 Live Services

- 🔗 [Swagger Docs](https://api.a-pani.com/v1/docs)
- 🔗 [Portfolio Website](https://portfolio.a-pani.com)

---

## 🧪 Setup

### Local Development

Navigate to each microservice directory and run:

```bash
# Install dependencies
npm install

# Run local server
npm run server
```

### Production (PM2)

```bash
# Start production service with PM2
pm2 start ecosystem.config.js

# Restart (after updates)
pm2 restart all

# Test for 
```

### Debugging
```
pm2 logs <service-name>  # Example: pm2 logs 5007-config-service
pm2 list                 # To view all running services
pm2 monit                # Interactive real-time monitoring
```

---

## 🌱 Environment Variables
All environment variables are dynamically injected via AWS SSM for enhanced security.

---

## 📫 Contact

**Nguyen Bui**  
[LinkedIn](https://www.linkedin.com/in/jackbui96/) • [GitHub](https://github.com/Jackbui96)

---

## 📘 License

This project is licensed under the MIT License.
