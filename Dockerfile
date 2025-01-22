# Step 1: Use the official Node.js image as the base
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and lock file
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the Next.js application
RUN npm run build

# Step 7: Expose the port the app runs on
EXPOSE 3000

# Step 8: Start the application
CMD ["npm", "start"]
