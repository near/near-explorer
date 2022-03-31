FROM mhart/alpine-node:16

WORKDIR /near-explorer/backend
ENV HOME=/tmp
COPY ./package.json ./package-lock.json ./
RUN npm install --prod
COPY ./ ./

ENTRYPOINT ["npm run start"]
