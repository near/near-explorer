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
COPY ./ ./
RUN npm clean-install
RUN npm run build


FROM mhart/alpine-node:slim-12

WORKDIR /near-explorer/frontend
RUN chown nobody: .
USER nobody
ENV HOME=/tmp
COPY --from=node-modules /near-explorer/frontend/node_modules ./node_modules
COPY ./static ./static
COPY --from=build /near-explorer/frontend/.next ./.next

EXPOSE 3000
CMD ["./node_modules/.bin/next", "start", "--port", "3000"]
