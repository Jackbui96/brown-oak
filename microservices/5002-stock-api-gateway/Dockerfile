# Use a lightweight JDK base image
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy the JAR file built by Gradle
COPY build/libs/stock-api-gateway-0.0.1-SNAPSHOT.jar app.jar

# Expose the port Spring Boot runs on
EXPOSE 5002

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
