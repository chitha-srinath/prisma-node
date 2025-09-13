
# Build stage
FROM node:22.19-alpine3.22 AS builder

WORKDIR /build

COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (needed for build)
RUN npm i && npm cache clean --force

COPY . .
RUN npm run build

# Generate Prisma client
RUN npx prisma generate

# Remove dev dependencies
RUN npm prune --production

# Production stage
FROM node:22.19-alpine3.22 

WORKDIR /app

COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/package*.json ./package*.json
COPY --from=builder /build/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/server.js"]
