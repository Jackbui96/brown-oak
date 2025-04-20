#!/bin/bash

echo "📦 Installing dependencies for all microservices..."

SERVICES=(
    "5003-user-service"
    "5004-gemini-service"
    "5005-web-tracking-service"
    "5006-docstore-service"
    "5007-config-service"
)

for SERVICE in "${SERVICES[@]}"
do
    echo "🔧 Installing for $SERVICE..."
    (cd ./microservices/$SERVICE && npm install)
done

echo "🚀 Starting all services with PM2..."
pm2 start ecosystem.config.js
