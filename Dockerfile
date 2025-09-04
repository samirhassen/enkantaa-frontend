FROM node:18-alpine

RUN apk add --no-cache build-base

WORKDIR /app

ADD package.json package-lock.json /app/

RUN npm install

COPY . /app/

RUN npm run build

EXPOSE 9898

CMD ["npm", "run", "preview"]
