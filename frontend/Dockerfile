# Use the base image for Node.js
FROM node:16

# Set the working directory
WORKDIR /app/frontend

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port on which the app runs (default React app port is 3000)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
