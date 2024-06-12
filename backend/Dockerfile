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

# Expose port mà ứng dụng Node.js lắng nghe
EXPOSE 5000

# Khởi chạy ứng dụng Node.js bằng script start của package.json
CMD ["npm", "start"]
