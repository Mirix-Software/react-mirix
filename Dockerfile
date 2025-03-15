# Dockerfile для фронтенда
FROM node:22-alpine as frontend-builder

WORKDIR /workspace/frontend
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM nginx:alpine

RUN apk add --no-cache bash

COPY --from=frontend-builder /workspace/frontend/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
