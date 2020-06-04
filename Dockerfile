FROM node:13.6.0
#working directory
WORKDIR /pappaya/testdevsign
COPY . .
RUN npm install && npm run build && npm install -g pm2 && pm2 start server.js
EXPOSE 8080
CMD [ "node", "server.js" ]
