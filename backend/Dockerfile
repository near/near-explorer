FROM mhart/alpine-node:12

USER root

RUN apk add --no-cache runit

WORKDIR /near-explorer/backend
ENV HOME=/tmp
COPY ./package.json ./package-lock.json ./
RUN apk add --no-cache --virtual=.build-dependencies git && \
    npm clean-install --prod && \
    rm -r /tmp/.npm && \
    chown nobody: . && \
    apk del .build-dependencies
COPY ./ ./
RUN mkdir -p ./db ./services/near-explorer-backend && \
    touch /etc/envvars && \
    chown nobody: /etc/envvars && \
    echo 'export > /etc/envvars && cp -r ./services /tmp/services && find /tmp/services -name run -exec chmod +x {} + && exec /sbin/runsvdir /tmp/services' > /opt/runit-bootstrap && \
    echo -e '#!/bin/sh\nsource /etc/envvars && cd /near-explorer/backend && exec npm run start' > ./services/near-explorer-backend/run && \
    \
    chown -R nobody: ./db ./services
USER nobody
ENTRYPOINT ["/bin/sh", "/opt/runit-bootstrap"]
