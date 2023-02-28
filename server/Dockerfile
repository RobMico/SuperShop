FROM node:18
WORKDIR /usr/src/server
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5001
CMD [ "npm", "run", "start_dev" ]