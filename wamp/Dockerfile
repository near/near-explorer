FROM crossbario/crossbar

COPY config.json /node/
RUN chown -R crossbar:crossbar /node/

ENTRYPOINT ["crossbar", "start", "--cbdir", "/node/"]
