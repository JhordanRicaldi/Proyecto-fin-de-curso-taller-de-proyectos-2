
FROM node:lts-alpine3.19

WORKDIR /app

COPY package*.json ./

RUN npm install  

COPY . .

RUN npm install

EXPOSE 3001

CMD ["npm", "run", "dev"]