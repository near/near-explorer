FROM mhart/alpine-node:16 AS build

RUN apk add --no-cache --update \
  python3 \
  make \
  gcc \
  g++

WORKDIR /near-explorer/frontend
ENV HOME=/tmp
COPY ./package.json ./package-lock.json ./
COPY patches ./patches
RUN npm install --prod
RUN cp -a node_modules ../production_node_modules
RUN npm install

COPY ./ ./

RUN npm run build
RUN npm run compile-nextjs-config

FROM mhart/alpine-node:16

RUN apk add --no-cache --update \
  python3 \
  make \
  gcc \
  g++

WORKDIR /near-explorer/frontend
ENV HOME=/tmp \
    PORT=3000
COPY --from=build /near-explorer/production_node_modules ./node_modules
COPY --from=build /near-explorer/frontend/public ./public
COPY --from=build /near-explorer/frontend/next.config.js ./
COPY --from=build /near-explorer/frontend/.next ./.next
COPY --from=build /near-explorer/frontend/server ./server
COPY --from=build /near-explorer/frontend/package.json ./package.json

CMD ["/bin/sh", "-c", "npm run start"]
