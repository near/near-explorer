FROM crossbario/crossbar

COPY config.json /node/config.json
RUN ls -lah /node

ENTRYPOINT ["crossbar", "start", "--cbdir", "/node/"]
