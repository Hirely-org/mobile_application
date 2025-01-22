FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Use Webpack instead of Turbopack for reliable builds
RUN npm run build -- --no-turbopack || (echo "Build failed! Check logs for details." && exit 1)

EXPOSE 3000

CMD ["npm", "start"]
