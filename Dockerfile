# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# copy package files
COPY package*.json ./

# ติดตั้ง dependencies แบบ deterministic
RUN npm install --legacy-peer-deps

# copy source code
COPY . .

# build Next.js app
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# copy build output & dependencies
COPY --from=builder /app ./

# expose port
EXPOSE 3000

# start Next.js
CMD ["npm", "run", "start"]
