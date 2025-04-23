#!/bin/bash

echo "📦 Installing dependencies for microservices..."

# Python (5001)
echo "🐍 Installing Python dependencies for 5001-stock-prediction-service..."
cd ./microservices/5001-stock-prediction-service || exit
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

echo "🛠️ Generating gRPC Python files..."
python -m grpc_tools.protoc -I proto --python_out=. --grpc_python_out=. proto/stock_predict.proto

deactivate
cd - || exit

# Spring Boot (5002)
echo "☕ Building Spring Boot service 5002-stock-api-gateway..."
cd ./microservices/5002-stock-api-gateway || exit

echo "🛠️ Generating gRPC Java files..."
./gradlew generateProto

echo "🔨 Building Spring Boot app..."
./gradlew build --no-daemon

cd - || exit

# Other services (Node-based)
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
    echo "🔧 Installing Node dependencies for $SERVICE..."
    (cd ./microservices/$SERVICE && npm install)
done

echo "🚀 Starting all services with PM2..."
pm2 start ecosystem.config.js
