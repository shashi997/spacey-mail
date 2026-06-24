# Use an official Node runtime that comes with all Puppeteer dependencies pre-installed
FROM ghcr.io/puppeteer/puppeteer:22.12.0

# Set the working directory inside the container
WORKDIR /app

# Copy package files first (helps with build caching)
COPY package*.json ./

# Install all dependencies (including typescript devDependencies)
RUN npm ci

# Copy the rest of your server application code
COPY . .

# Build your TypeScript project into JavaScript (runs 'tsc')
RUN npm run build

# Expose the port your Express app listens on
EXPOSE 8080

# Start the application
CMD ["npm", "start"]