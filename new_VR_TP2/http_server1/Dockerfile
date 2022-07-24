FROM node:latest

WORKDIR /server

COPY ["package.json", "./"]

RUN npm install 

COPY . .

CMD [ "node", "server1.js" ]
