# Use Node 22 Alpine as a lightweight, modern base
FROM node:22-alpine

# Install Chromium and the system libraries Puppeteer needs to run on Linux
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

# Tell Puppeteer to use the system-installed Chromium instead of downloading its own
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Set the working directory
WORKDIR /app

# Copy package configurations
COPY package*.json ./

# Clean install dependencies (with network retry safety)
RUN npm ci --network-timeout=100000

# Copy the rest of your app code
COPY . .

# Build your TypeScript project
RUN npm run build

# Expose port and start
EXPOSE 8080
CMD ["npm", "start"]