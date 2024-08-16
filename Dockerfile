FROM node:20.16.0-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /home/node/app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npm run build

FROM node:20.16.0-alpine

RUN apk add --no-cache openssl

WORKDIR /home/node/app

COPY --from=builder /home/node/app/package*.json ./
COPY --from=builder /home/node/app/node_modules ./node_modules
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/prisma ./prisma

RUN chown -R node:node /home/node/app

USER node

CMD ["npm", "run", "start:dev"]
