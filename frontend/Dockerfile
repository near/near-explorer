FROM mhart/alpine-node:12 AS node-modules

WORKDIR /near-explorer/frontend
ENV HOME=/tmp
COPY ./package.json ./package-lock.json ./
RUN npm clean-install --prod


FROM mhart/alpine-node:12 AS build

WORKDIR /near-explorer/frontend
ENV HOME=/tmp
COPY ./package.json ./package-lock.json ./
RUN npm clean-install
COPY ./ ./
RUN npm run build


FROM mhart/alpine-node:slim-12

WORKDIR /near-explorer/frontend
ENV HOME=/tmp
COPY --from=node-modules /near-explorer/frontend/node_modules ./node_modules
COPY ./static ./static
COPY --from=build /near-explorer/frontend/next.config.js ./
COPY --from=build /near-explorer/frontend/.next ./.next

EXPOSE 3000
CMD ["./node_modules/.bin/next", "start", "--port", "3000"]
