# syntax=docker/dockerfile:1
ARG NODE_VERSION=24.13.1

FROM node:${NODE_VERSION}-alpine

# Use development node environment configuration locally
ENV NODE_ENV development
WORKDIR /usr/src/app

COPY package.json ./

# FIXED: Removed --omit=dev so devDependencies like nodemon are preserved locally
RUN npm install

USER node

COPY . .

EXPOSE 3000
CMD ["npm", "start"]