# Stage 1: Build React App
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve dengan NGINX
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Copy konfigurasi NGINX custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]