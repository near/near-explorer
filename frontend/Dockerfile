FROM mhart/alpine-node:16 AS build

WORKDIR /near-explorer/common
COPY ./common/package.json ./common/package-lock.json ./
RUN npm clean-install

WORKDIR /near-explorer/frontend
ENV HOME=/tmp
COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm clean-install --prod
RUN cp -a node_modules ../production_node_modules
RUN npm clean-install

COPY ./common ../common
COPY ./frontend ./
COPY ./backend ../backend/

RUN npm run build
RUN npm run compile-nextjs-config

FROM mhart/alpine-node:16

WORKDIR /near-explorer/frontend
ENV HOME=/tmp \
    PORT=3000
COPY --from=build /near-explorer/production_node_modules ./node_modules
COPY --from=build /near-explorer/frontend/public ./public
COPY --from=build /near-explorer/frontend/next.config.js ./
COPY --from=build /near-explorer/frontend/.next ./.next
COPY --from=build /near-explorer/frontend/package.json ./package.json

CMD ["npm run start --port $PORT"]
