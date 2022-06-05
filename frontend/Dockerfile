FROM mhart/alpine-node:16 AS build

WORKDIR /near-explorer
ENV HOME=/tmp
COPY ./package-lock.json ./package.json ./tsconfig.json ./
COPY ./patches/ ./patches/
COPY ./common/package.json ./common/tsconfig.json ./common/
COPY ./frontend/package.json ./frontend/tsconfig.json ./frontend/
COPY ./backend/package.json ./backend/tsconfig.json ./backend/
RUN npm clean-install

COPY ./common ./common
COPY ./frontend ./frontend
COPY ./backend ./backend

RUN npm run -w frontend build
RUN npm run -w frontend compile-nextjs-config

RUN rm -rf ./node_modules
RUN npm install patch-package
RUN npm install -w frontend -w common --prod

FROM mhart/alpine-node:16

RUN apk add --no-cache git

WORKDIR /near-explorer
ENV HOME=/tmp \
    PORT=3000
COPY --from=build /near-explorer/node_modules ./node_modules
COPY --from=build /near-explorer/package.json ./package.json
COPY --from=build /near-explorer/frontend/public ./frontend/public
COPY --from=build /near-explorer/frontend/next.config.js ./frontend/
COPY --from=build /near-explorer/frontend/.next ./frontend/.next
COPY --from=build /near-explorer/frontend/package.json ./frontend/package.json

ENTRYPOINT ["npm", "run", "-w", "frontend", "start"]
