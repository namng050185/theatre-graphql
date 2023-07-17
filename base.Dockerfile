#Build main image
#command:   docker build --pull --rm -t namng050185/nest-api . -f base.Dockerfile
#push:   docker push namng050185/nest-api

FROM node:14-alpine

WORKDIR /workspace

COPY package.json package-lock.json /workspace/

RUN npm i