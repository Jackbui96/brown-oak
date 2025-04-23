module.exports = {
    apps: [
        {
            name: '5001-stock-predict-core',
            script: 'python3',
            args: 'server.py',
            interpreter: '/home/ubuntu/brown-oak/microservices/5001-stock-predict-core/.venv/bin/python',
            cwd: '/home/ubuntu/brown-oak/microservices/5001-stock-predict-core',
            watch: false,
            env: {
                PORT: 5001
            }
        },
        {
            name: '5002-stock-api-gateway',
            script: 'java',
            args: '-jar stock-api-gateway-0.0.1-SNAPSHOT.jar',
            cwd: '/home/ubuntu/brown-oak/microservices/5002-stock-api-gateway',
            watch: false,
            env: {
                PORT: 5002
            }
        },
        {
            // 👤 Handles user registration, login, and profile info
            name: "5003-user-service",
            script: "./microservices/5003-user-service/src/app.js",
            watch: false,
            env: {
                NODE_ENV: "production",
                PORT: 5003,
            },
        },
        {
            // 🤖 Gemini AI integration for chat/response generation
            name: "5004-gemini-service",
            script: "./microservices/5004-gemini-service/src/app.js",
            watch: false,
            env: {
                NODE_ENV: "production",
                PORT: 5004,
            },
        },
        {
            // 📈 Tracks site visits, analytics, and user activity
            name: "5005-web-tracking-service",
            script: "./microservices/5005-web-tracking-service/src/app.js",
            watch: false,
            env: {
                NODE_ENV: "production",
                PORT: 5005,
            },
        },
        {
            // 📄 Handles resume generation, download links via S3
            name: "5006-docstore-service",
            script: "./microservices/5006-docstore-service/src/app.js",
            watch: false,
            env: {
                NODE_ENV: "production",
                PORT: 5006,
            },
        },
        {
            // ⚙️ Fetches dynamic environment configs via AWS SSM
            name: "5007-config-service",
            script: "./microservices/5007-config-service/src/app.js",
            watch: false,
            env: {
                NODE_ENV: "production",
                PORT: 5007,
            },
        },
        {
            // 📘 Hosts centralized Swagger UI for API documentation
            name: "9999-swagger-service",
            script: "./microservices/9999-swagger-service/src/app.js",
            watch: false,
            env: {
                NODE_ENV: "production",
                PORT: 9999,
            },
        },
    ],
};
