# Official Node.js alpine (lts-alpine) image from Docker Hub
FROM node@sha256:6ad8c47f099bc2440e0fc42f17a03297fa79955f559f10087cabf377c43ddbce
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .