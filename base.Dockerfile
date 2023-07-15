

FROM node:14-alpine

WORKDIR /workspace

COPY package.json package-lock.json /workspace/

RUN npm i