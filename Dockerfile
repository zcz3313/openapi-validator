FROM node:18.3-alpine3.15

WORKDIR /openapi-validator

COPY . /openapi-validator/

RUN npm install

RUN npm run link

WORKDIR /data

ENTRYPOINT ["lint-openapi"]
