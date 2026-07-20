FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY backend ./backend

ENV NODE_ENV=production
EXPOSE 8787

CMD ["npm", "run", "api"]
