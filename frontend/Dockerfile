FROM node:16-alpine AS build

WORKDIR /near-explorer
ENV HOME=/tmp
COPY ./package-lock.json ./package.json ./tsconfig.json ./
COPY ./patches/ ./patches/
COPY ./common ./common
COPY ./frontend ./frontend
COPY ./backend ./backend
RUN npm clean-install

RUN npm run -w frontend build
RUN npm run -w frontend compile-nextjs-config

RUN rm -rf ./node_modules
RUN npm install patch-package
RUN npm install -w frontend -w common --prod

FROM node:16-alpine

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
COPY --from=build /near-explorer/frontend/node_modules ./frontend/node_modules

ENTRYPOINT ["npm", "run", "-w", "frontend", "start"]
