# Sử dụng image Node.js chính thức làm image base
FROM node:20.12.1

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy file package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các dependency
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng ReactJS
RUN npm run build

# Sử dụng Nginx để serve ứng dụng ReactJS
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

# Expose port 80 để truy cập
EXPOSE 80

# Khởi chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
