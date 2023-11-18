# Base image
FROM node:16.13.1

# Create app directory
WORKDIR /app

COPY package.json ./

RUN npm install
# Bundle app source
COPY . .
RUN npm install -g ts-node

EXPOSE 8000
CMD [ "ts-node-esm", "collaboration_server.ts" ]