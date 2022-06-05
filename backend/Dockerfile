FROM mhart/alpine-node:16 AS build

WORKDIR /near-explorer
ENV HOME=/tmp
COPY ./package-lock.json ./package.json ./tsconfig.json ./
COPY ./patches/ ./patches/
COPY ./common/package.json ./common/tsconfig.json ./common/
COPY ./backend/package.json ./backend/tsconfig.json ./backend/
RUN npm clean-install

COPY ./common ./common
COPY ./backend ./backend

RUN npm run -w backend build

RUN rm -rf ./node_modules
RUN npm install patch-package
RUN npm install -w backend -w common --prod

FROM mhart/alpine-node:16

WORKDIR /near-explorer
ENV HOME=/tmp
COPY --from=build /near-explorer/node_modules ./node_modules
COPY --from=build /near-explorer/package.json ./package.json
COPY --from=build /near-explorer/backend/build/ ./backend/build/
COPY --from=build /near-explorer/backend/package.json ./backend/package.json

USER nobody
ENTRYPOINT ["npm", "run", "-w", "backend", "start"]
