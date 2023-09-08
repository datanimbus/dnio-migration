FROM node:18-alpine

WORKDIR /tmp/app

COPY . .

RUN npm install --no-audit