FROM node:16-alpine
WORKDIR /app/web/
COPY package*.json /app/web/
RUN npm install
COPY . /app/web/
EXPOSE 3000
CMD ["npm", "run", "dev"]