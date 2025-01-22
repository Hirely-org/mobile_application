FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Use Webpack instead of Turbopack for reliable builds
RUN npm run build

EXPOSE 3000

CMD ["npx", "next", "dev"]
