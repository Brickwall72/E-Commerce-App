# syntax=docker/dockerfile:1
ARG NODE_VERSION=24.13.1

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV development
WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 5173

# ❌ REMOVED: USER node

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
