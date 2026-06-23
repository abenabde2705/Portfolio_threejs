# Production stage
FROM node:20-alpine AS prod

WORKDIR /app
ENV DOCKER=true

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]

# Dev stage (live reload)
FROM node:20-alpine AS dev

WORKDIR /app
ENV DOCKER=true

COPY package*.json ./
RUN npm install

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
