FROM node:20-alpine3.17

COPY . .
RUN npm install -g localtunnel
RUN lt --port 3000 &
RUN npm install
CMD ["node", "index.js"]