FROM node:lts

WORKDIR /bot

COPY package*.json ./

RUN npm i

COPY . .

CMD [ "node", "./src/" ]