# Step 1: Build the React app
FROM node:18-slim AS build

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .
RUN npm run build

# Step 2: Serve the build using Nginx
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/vite.config.js /tmp/

# Custom nginx config to handle SPA routing if needed
# For now, we'll use a simple production serve approach or just the build
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
