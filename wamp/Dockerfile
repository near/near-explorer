FROM crossbario/crossbar

RUN chown -R crossbar:crossbar /node/
COPY config.json /node/

RUN id
RUN env

ENTRYPOINT ["crossbar", "start", "--cbdir", "/node/"]
