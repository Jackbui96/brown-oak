#!/bin/bash

echo "📦 Installing dependencies for all microservices..."

SERVICES=(
    "5003-user-service"
    "5004-gemini-service"
    "5005-web-tracking-service"
    "5006-docstore-service"
    "5007-config-service"
    "9999-swagger-service"
)

for SERVICE in "${SERVICES[@]}"
do
    echo "🔧 Installing for $SERVICE..."
    (cd ./microservices/$SERVICE && npm install)
done

echo "🧠 Generating gRPC for Python stock-predict-core..."

cd ./microservices/5001-stock-predict-core
python3 -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. stock.proto

echo "🛠️ Generating gRPC and building Spring Boot stock-api-gateway..."

cd ../5002-stock-api-gateway
./gradlew generateProto  # Optional: if using the protobuf Gradle plugin
./gradlew bootJar

cd ../../../
echo "🚀 Starting all services with PM2..."
pm2 start ecosystem.config.js
