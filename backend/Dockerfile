FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm ci

RUN npx prisma generate

COPY . .
RUN npm run build

FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN npm ci --omit=dev && npx prisma generate

FROM node:22-alpine

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY prisma.config.ts ./
COPY package*.json ./

ENV NODE_ENV=production

RUN mkdir -p /app/public/uploads && chown -R node:node /app/public

USER node

EXPOSE 3000

CMD ["node", "dist/server.js"]
