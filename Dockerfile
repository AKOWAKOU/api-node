FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install \
&& npm install axios cors mongoose morgan 

COPY . .

EXPOSE 3002

CMD ["npm", "start"]
