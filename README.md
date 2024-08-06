
# Hướng Dẫn Cài Đặt và Cấu Hình Dự Án

## 1. Chạy Docker Compose
Truy cập vào thư mục gốc của dự án và chạy lệnh sau để khởi động các container Docker:

```bash
docker-compose up -d
```

## 2. Thực hiện di trú cơ sở dữ liệu
Truy cập vào thư mục `backend` và chạy lệnh sau để thực hiện di trú (migrate) cơ sở dữ liệu bằng Sequelize:

```bash
docker-compose exec backend bash -c "npx sequelize-cli db:migrate"
```

## 3. Kết nối cơ sở dữ liệu với DBeaver
Dưới đây là thông tin để kết nối cơ sở dữ liệu PostgreSQL với DBeaver:

- **Host:** localhost
- **Port:** 5433
- **Database:** chongluadaoreact
- **Username:** postgres
- **Password:** 12345

## 4. Thêm dữ liệu vào bảng `Groups`
Sử dụng DBeaver hoặc một công cụ quản lý cơ sở dữ liệu khác để tạo các hàng (row) trong bảng `Groups` với thông tin sau:

| id | groupName | description | createdAt                          | updatedAt                          |
|----|-----------|-------------|------------------------------------|------------------------------------|
| 1  | admin     | admin       | 2020-01-01 00:00:00.000 +0700      | 2020-01-01 00:00:00.000 +0700      |
| 2  | user      | user        | 2020-01-01 00:00:00.000 +0700      | 2020-01-01 00:00:00.000 +0700      |
| 3  | banner    | banner      | 2020-01-01 00:00:00.000 +0700      | 2020-01-01 00:00:00.000 +0700      |

## 5. Thêm dữ liệu vào bảng `Roles`
Tạo các hàng (row) trong bảng `Roles` với thông tin sau:

| id | roleName | permission           | description | createdAt                          | updatedAt                          |
|----|----------|----------------------|-------------|------------------------------------|------------------------------------|
| 1  | admin    | {'c','r','u','d'}     | admin       | 2020-01-01 00:00:00.000 +0700      | 2020-01-01 00:00:00.000 +0700      |
| 2  | user     | {'c','r'}             | user        | 2020-01-01 00:00:00.000 +0700      | 2020-01-01 00:00:00.000 +0700      |
| 3  | banner   | {'r'}                 | banner      | 2020-01-01 00:00:00.000 +0700      | 2020-01-01 00:00:00.000 +0700      |

## Lưu ý
Sau khi đăng ký người dùng, mặc định cột `groupId` trong bảng `Users` sẽ có giá trị là `2` (tức là thuộc nhóm `user`). Bạn cần thay đổi `groupId` của người dùng thành `1` để họ có quyền admin.
```

