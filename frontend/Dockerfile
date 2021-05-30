FROM mhart/alpine-node:12 AS build

WORKDIR /near-explorer/frontend
ENV HOME=/tmp
COPY ./package.json ./package-lock.json ./
RUN npm install --prod && \
    cp -a node_modules ../production_node_modules && \
    npm install

COPY ./ ./

RUN npm run build


FROM mhart/alpine-node:12

WORKDIR /near-explorer/frontend
ENV HOME=/tmp \
    PORT=3000
COPY --from=build /near-explorer/production_node_modules ./node_modules
COPY --from=build /near-explorer/frontend/public ./public
COPY --from=build /near-explorer/frontend/next.config.js ./
COPY --from=build /near-explorer/frontend/src/libraries/consts.js ./src/libraries/consts.js
COPY --from=build /near-explorer/frontend/.next ./.next
COPY --from=build /near-explorer/frontend/package.json ./package.json

CMD ["/bin/sh", "-c", "exec ./node_modules/.bin/next start --port $PORT"]
