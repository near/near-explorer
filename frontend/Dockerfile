FROM mhart/alpine-node:12 AS node-modules

WORKDIR /near-explorer/frontend
RUN chown nobody: .
USER nobody
ENV HOME=/tmp
COPY ./package.json ./package-lock.json ./
RUN npm clean-install --prod


FROM mhart/alpine-node:12 AS build

WORKDIR /near-explorer/frontend
RUN chown nobody: .
USER nobody
ENV HOME=/tmp
COPY ./package.json ./package-lock.json ./
RUN npm clean-install
COPY ./ ./
RUN npm run build


FROM mhart/alpine-node:slim-12

WORKDIR /near-explorer/frontend
RUN chown nobody: .
USER nobody
ENV HOME=/tmp \
    PORT=3000
EXPOSE 3000
COPY --from=node-modules /near-explorer/frontend/node_modules ./node_modules
COPY ./static ./static
COPY --from=build /near-explorer/frontend/next.config.js ./
COPY --from=build /near-explorer/frontend/.next ./.next

CMD ["/bin/sh", "-c", "exec ./node_modules/.bin/next start --port $PORT"]
