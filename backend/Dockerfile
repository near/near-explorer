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
RUN mkdir ./db && \
    touch /etc/envvars && \
    echo 'export > /etc/envvars; exec /sbin/runsvdir /etc/service' > /opt/runit-bootstrap && \
    if ! stat -t service_* >/dev/null 2>&1 ; then \
        echo -e '#!/bin/sh -e \nsource /etc/envvars && cd /near-explorer/backend && exec npm run start' > ./service_localnet_run; \
    fi && \
    \
    for service in service_*; do \
        service_path=/etc/$(echo "$service" | sed 's:_:/:g') && \
        mkdir -p "$(dirname "$service_path")" && \
        cp "$service" "$service_path" && \
        chmod +x "$service_path"; \
    done && \
    \
    chown -R nobody: ./db /etc/service /etc/envvars
USER nobody
ENTRYPOINT ["/bin/sh", "-e", "/opt/runit-bootstrap"]
