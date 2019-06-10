FROM mhart/alpine-node:12

WORKDIR /near-explorer/backend
RUN chown nobody: .
USER nobody
ENV HOME=/tmp
COPY ./ ./
RUN npm clean-install --prod
RUN mkdir ./db

CMD ["npm", "run", "start"]
