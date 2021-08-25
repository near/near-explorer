FROM mhart/alpine-node:16

USER root

WORKDIR /near-explorer/backend
ENV HOME=/tmp
COPY ./package.json ./package-lock.json ./
RUN apk add --no-cache --virtual=.build-dependencies git python2 make g++ musl-dev && \
    npm clean-install --prod && \
    rm -r /tmp/.npm && \
    apk del .build-dependencies && \
    mkdir db && \
    chown nobody: db

COPY ./ ./

USER nobody
ENTRYPOINT ["npm", "run", "start"]
