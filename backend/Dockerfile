FROM mhart/alpine-node:12

USER root

WORKDIR /near-explorer/backend
ENV HOME=/tmp
COPY ./package.json ./package-lock.json ./
RUN apk add --no-cache --virtual=.build-dependencies git && \
    npm clean-install --prod && \
    rm -r /tmp/.npm && \
    apk del .build-dependencies && \
    mkdir db && \
    chown nobody: db

COPY ./ ./

USER nobody
ENTRYPOINT ["npm", "run", "start"]
