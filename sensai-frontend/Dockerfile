FROM node:22.12-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --include=dev

# Copy the rest of the application
COPY . .

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]

