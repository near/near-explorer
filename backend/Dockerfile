FROM mhart/alpine-node:12

WORKDIR /near-explorer/backend
ENV HOME=/tmp
COPY ./package.json ./package-lock.json ./
USER root
RUN apk add --no-cache --virtual=.build-dependencies git && \
    npm clean-install --prod && \
    rm -r /tmp/.npm && \
    chown nobody: . && \
    apk del .build-dependencies
COPY ./ ./
RUN mkdir ./db && \
    chown -R nobody: .

USER nobody
CMD ["/bin/sh", "-c", "exec npm run start"]
