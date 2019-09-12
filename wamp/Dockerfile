FROM crossbario/crossbar

COPY config.json ./.crossbar/config.json
USER 0
RUN chown -R crossbar:crossbar /node/
USER crossbar

#ENTRYPOINT ["crossbar", "start", "--cbdir", "/node/"]
