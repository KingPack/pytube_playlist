FROM node:22 AS build

WORKDIR /app
COPY front-end/package*.json ./
RUN npm install
COPY front-end/ .
RUN npm run build

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
