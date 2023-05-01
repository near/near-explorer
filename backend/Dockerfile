FROM node:20-alpine AS build

WORKDIR /near-explorer
ENV HOME=/tmp
COPY ./package-lock.json ./package.json ./tsconfig.json ./
COPY ./patches/ ./patches/
COPY ./common ./common
COPY ./backend ./backend
RUN npm clean-install

RUN npm run -w backend build

RUN rm -rf ./node_modules
RUN npm install patch-package
RUN npm install -w backend -w common --prod

FROM node:20-alpine

WORKDIR /near-explorer
ENV HOME=/tmp
COPY --from=build /near-explorer/node_modules ./node_modules
COPY --from=build /near-explorer/tsconfig.json ./tsconfig.json
COPY --from=build /near-explorer/package.json ./package.json
COPY --from=build /near-explorer/backend/build/ ./backend/build/
COPY --from=build /near-explorer/backend/package.json ./backend/package.json
COPY --from=build /near-explorer/backend/tsconfig.json ./backend/tsconfig.json
COPY --from=build /near-explorer/backend/node_modules ./backend/node_modules

USER nobody
ENTRYPOINT ["npm", "run", "-w", "backend", "start"]
