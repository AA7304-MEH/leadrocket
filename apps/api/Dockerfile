# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root workspace configuration
COPY package*.json ./
COPY turbo.json ./
COPY apps/api/package*.json ./apps/api/

# Install dependencies (using root lockfile)
RUN npm install

# Copy source code
COPY . .

# Build the backend
RUN npm run build --filter=@leadrockets/api

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install only production dependencies
COPY apps/api/package*.json ./
RUN npm install --only=production

# Copy build artifacts from builder
COPY --from=builder /app/apps/api/dist ./dist

# Expose port
EXPOSE 5000

# Start the engine
CMD ["node", "dist/server.js"]
