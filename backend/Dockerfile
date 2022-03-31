FROM mhart/alpine-node:16 AS build

WORKDIR /near-explorer/backend
ENV HOME=/tmp
COPY ./backend/package.json ./backend/package-lock.json ./
RUN npm clean-install --prod
RUN cp -a node_modules ../production_node_modules
RUN npm clean-install

COPY ./backend ./
COPY ./frontend ../frontend/

RUN npm run build

FROM mhart/alpine-node:16

WORKDIR /near-explorer/backend
ENV HOME=/tmp
COPY --from=build /near-explorer/production_node_modules ./node_modules
COPY --from=build /near-explorer/backend/build/backend ./build/backend
COPY --from=build /near-explorer/backend/package.json ./package.json

USER nobody
ENTRYPOINT ["npm run start"]
