# ── Stage 1: Build ──────────────────────────────────────
FROM node:18-alpine AS builder
 
WORKDIR /app
 
# Copy package files dulu (cache layer)
COPY package*.json ./
RUN npm ci
 
# Copy source code
COPY . .
 
# Build TypeScript ke JavaScript
RUN npm run build
 
# ── Stage 2: Production ─────────────────────────────────
FROM node:18-alpine AS production
 
WORKDIR /app
 
ENV NODE_ENV=production
 
# Copy hanya production dependencies
COPY package*.json ./
RUN npm ci --only=production
 
# Copy hasil build dari stage 1
COPY --from=builder /app/dist ./dist
 
EXPOSE 3000
 
CMD ["node", "dist/main"]
