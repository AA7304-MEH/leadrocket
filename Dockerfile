# Stage 1: Build
FROM node:20-slim AS builder

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy root workspace configuration
COPY package*.json ./
COPY turbo.json ./
COPY apps/api/package*.json ./apps/api/

# Install dependencies (using root lockfile)
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate --schema=apps/api/prisma/schema.prisma

# Build the backend
RUN npx turbo run build --filter=@leadrockets/api

# Stage 2: Production
FROM node:20-slim AS runner

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy Prisma schema
COPY apps/api/prisma ./prisma

# Install only production dependencies
COPY apps/api/package*.json ./
RUN npm install --only=production

# Generate Prisma Client in runner
RUN npx prisma generate

# Copy build artifacts from builder
COPY --from=builder /app/apps/api/dist ./dist

# Expose port
EXPOSE 5000

# Start the engine
CMD ["node", "dist/server.js"]
