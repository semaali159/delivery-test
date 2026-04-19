FROM node:20-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3003

CMD ["npm", "run", "start:dev"]