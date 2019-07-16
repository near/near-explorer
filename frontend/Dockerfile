FROM mhart/alpine-node:12 AS build

WORKDIR /near-explorer/frontend
RUN chown nobody: .
USER nobody
ENV HOME=/tmp
COPY ./package.json ./package-lock.json ./
RUN npm clean-install --prod && \
    cp -a node_modules production_node_modules && \
    npm clean-install
COPY ./ ./

# XXX: render.com always copies files as owned by UID 1000, GID 1000
USER root
RUN chown nobody: .
USER nobody

RUN npm run build


FROM mhart/alpine-node:slim-12

WORKDIR /near-explorer/frontend
ENV HOME=/tmp \
    PORT=3000
COPY --from=build /near-explorer/frontend/production_node_modules ./node_modules
COPY --from=build /near-explorer/frontend/static ./static
COPY --from=build /near-explorer/frontend/next.config.js ./
COPY --from=build /near-explorer/frontend/.next ./.next

CMD ["/bin/sh", "-c", "exec ./node_modules/.bin/next start --port $PORT"]
