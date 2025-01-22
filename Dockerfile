# Use the base Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the built standalone app
COPY .next/standalone ./
COPY .next/static ./static

# Expose the app's port
EXPOSE 3000

# Run the standalone server
CMD ["node", "server.js"]
