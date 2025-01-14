# Use Node.js as the base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 3001

# Start the application
CMD ["node", "app.js"]
