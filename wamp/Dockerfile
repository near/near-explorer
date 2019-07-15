FROM crossbario/crossbar

RUN chown -R crossbar:crossbar /node/
COPY config.json /node/

ENTRYPOINT ["crossbar", "start", "--cbdir", "/node/"]
