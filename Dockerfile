FROM node:latest
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install pm2 -g
EXPOSE 8080
ENTRYPOINT ["pm2", "serve", "dist/front-end", "--no-daemon"]