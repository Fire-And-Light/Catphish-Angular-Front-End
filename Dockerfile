FROM node:22-bookworm-slim
WORKDIR /app
COPY dist/front-end .
RUN npm install pm2 -g
EXPOSE 8080
ENTRYPOINT ["pm2", "serve", "/app", "--no-daemon"]
