FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install && npm install axios cors mongoose bordy-parse morgan \
&& npm audit fix --force

COPY . .

EXPOSE 3002

CMD ["npm", "start"]
