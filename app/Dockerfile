FROM node:alpine

RUN mkdir -p /app/api
RUN mkdir -p /app/client

ADD api /app/api/
ADD client /app/client/

RUN apk add --no-cache build-base && \
    cd /app/api && yarn && \
    cd /app/client && yarn && yarn run build && rm -rf ./node_modules \
    apk del build-base

WORKDIR /app/api

CMD node src/index.js

COPY docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE 3000