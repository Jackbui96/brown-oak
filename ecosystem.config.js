export default {
    apps: [
        {
            name: "5003-user-service",
            script: "./backend/microservices/5003-user-service/src/app.js",
            watch: false,
            env: {
                NODE_ENV: "production",
                PORT: 5003,
            },
        },
        {
            name: "5004-gemini-service",
            script: "./backend/microservices/5004-gemini-service/src/app.js",
            watch: false,
            env: {
                NODE_ENV: "production",
                PORT: 5004,
            },
        },
        {
            name: "5005-web-tracking-service",
            script: "./backend/microservices/5005-web-tracking-service/src/app.js",
            watch: false,
            env: {
                NODE_ENV: "production",
                PORT: 5005,
            },
        },
        {
            name: "5006-docstore-service",
            script: "./backend/microservices/5006-docstore-service/src/app.js",
            watch: false,
            env: {
                NODE_ENV: "production",
                PORT: 5006,
            },
        },
        {
            name: "5007-config-service",
            script: "./backend/microservices/5007-config-service/src/app.js",
            watch: false,
            env: {
                NODE_ENV: "production",
                PORT: 5007,
            },
        },
    ]
};
