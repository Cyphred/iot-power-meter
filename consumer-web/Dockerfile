FROM node:20-alpine
WORKDIR /app/consumer-web/
COPY package*.json /app/consumer-web/
RUN npm install
COPY . /app/consumer-web/
EXPOSE 3000
CMD ["npm", "run", "dev"]