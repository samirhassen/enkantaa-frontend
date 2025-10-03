FROM node:18-alpine

RUN apk add --no-cache build-base

WORKDIR /app

ADD package.json package-lock.json /app/

RUN npm install

COPY . /app/

# Accept build arg for API URL
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

EXPOSE 9898

CMD ["npm", "run", "preview"]
