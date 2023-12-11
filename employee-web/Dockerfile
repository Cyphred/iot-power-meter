FROM node:20-alpine
WORKDIR /app/employee-web/
COPY package*.json /app/employee-web/
RUN npm install
COPY . /app/employee-web/
EXPOSE 3000
CMD ["npm", "run", "dev"]