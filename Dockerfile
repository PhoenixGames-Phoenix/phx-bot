FROM node:lts

WORKDIR /bot

COPY package*.json ./

RUN npm i

COPY . .

RUN cd ./src/ && node .