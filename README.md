# Check STK Lừa Đảo

**Check STK Lừa Đảo** là ứng dụng web giúp người dùng kiểm tra và báo cáo các số tài khoản ngân hàng và thông tin cá nhân có liên quan đến hành vi lừa đảo. Ứng dụng cung cấp cơ chế lọc lừa đảo dựa trên danh sách thông tin kẻ lừa đảo mà người dùng tải lên.

## Giới Thiệu

Ứng dụng cung cấp các tính năng chính:

-   **Kiểm Tra Độ Uy Tín:** Nhập số tài khoản ngân hàng hoặc họ và tên của chủ tài khoản để kiểm tra thông tin có đáng tin cậy hay không. Hỗ trợ nhiều hệ thống ngân hàng và có thể mở rộng để hỗ trợ các dịch vụ như Momo, ZaloPay, số điện thoại, v.v.
-   **Tải Lên Danh Sách Kẻ Lừa Đảo:** Sau khi đăng ký và đăng nhập, bạn có thể tải lên danh sách kẻ lừa đảo với các thông tin cần thiết như số tài khoản, họ và tên, hệ thống ngân hàng, link chứng minh và lời khuyên.
-   **Báo Cáo Spam:** Nếu phát hiện hành vi spam, bạn có thể báo cáo để quản trị viên xử lý. Tài khoản vi phạm sẽ bị cấm không sử dụng được chức năng tải lên bài viết.

## Hướng Dẫn Cài Đặt

### Cài Đặt Ứng Dụng

1. **Clone Repository:**

    ```bash
    git clone <URL_CỦA_REPOSITORY>
    cd <THƯ MỤC_REPOSITORY>
    ```

2. **Chạy Docker:**

    Sử dụng Docker để khởi chạy các dịch vụ:

    ```bash
    docker compose up -d
    ```

3. **Chạy Migration và Seed Dữ Liệu:**

    ```bash
    docker-compose exec backend bash -c "npx sequelize-cli db:migrate"
    docker-compose exec backend bash -c "npx sequelize-cli db:seed:all"
    ```

### Kết Nối Cơ Sở Dữ Liệu

Bạn có thể kết nối cơ sở dữ liệu PostgreSQL với DBeaver để xem chi tiết hơn, hãy sử dụng các thông tin sau:

-   **Host:** localhost
-   **Port:** 5433
-   **Database:** chongluadaoreact
-   **Username:** postgres
-   **Password:** 12345

## Cách Sử Dụng

1. **Truy Cập Ứng Dụng:**

    - Đường link truy cập frontend: [http://localhost](http://localhost) (hoặc địa chỉ IP của máy chủ nếu bạn sử dụng Docker để chạy ứng dụng)

2. **Cấu trúc Docker:**
   Dự án sử dụng Docker Compose để quản lý các dịch vụ:
    - Frontend: Được phục vụ bởi Nginx, lắng nghe trên port 80.
    - Backend: Chạy trên Node.js, lắng nghe trên port 3001. - Postgres: Cơ sở dữ liệu PostgreSQL, lắng nghe trên port 5433.
3. **Môi trường phát triển:**
    - Frontend: Sử dụng Node.js để cài đặt dependencies và build ứng dụng ReactJS. Ứng dụng sau đó được phục vụ bởi Nginx.
    - Backend: Node.js xử lý các yêu cầu API, sử dụng Sequelize để kết nối và quản lý cơ sở dữ liệu PostgreSQL.

## Công Nghệ Sử Dụng

### Frontend

Ứng dụng frontend được xây dựng bằng các công nghệ và thư viện sau:

-   **React**: Thư viện JavaScript để xây dựng giao diện người dùng.
-   **Redux**: Thư viện quản lý trạng thái ứng dụng. Sử dụng `@reduxjs/toolkit` để cấu hình Redux và `react-redux` để kết nối Redux với React.
-   **Bootstrap**: Framework CSS để tạo giao diện người dùng đẹp và responsive.
-   **Formik**: Thư viện giúp quản lý form và xác thực.
-   **Yup**: Thư viện xác thực schema cho Formik.
-   **Axios**: Thư viện HTTP client để gửi yêu cầu và nhận dữ liệu từ API.
-   **React Router DOM**: Thư viện để quản lý routing trong ứng dụng React.
-   **React Toastify**: Thư viện để hiển thị thông báo toast.
-   **NProgress**: Thư viện để hiển thị thanh tiến trình khi tải trang.
-   **Sass**: Tiền xử lý CSS để viết mã CSS sạch hơn và dễ bảo trì.

Các công cụ xây dựng và kiểm thử:

-   **React Scripts**: Cung cấp các lệnh để khởi chạy, xây dựng và kiểm thử ứng dụng React.
-   **Jest DOM** và **React Testing Library**: Thư viện kiểm thử để đảm bảo ứng dụng hoạt động như mong đợi.

### Backend

Ứng dụng backend được xây dựng với các công nghệ và thư viện sau:

-   **Node.js**: Môi trường thực thi JavaScript phía máy chủ.
-   **Express**: Framework web cho Node.js. Cung cấp các công cụ và tính năng để xây dựng ứng dụng web và API.
-   **Sequelize**: ORM (Object-Relational Mapping) cho Node.js để làm việc với cơ sở dữ liệu SQL.2`.
-   **PostgreSQL**: Hệ quản trị cơ sở dữ liệu quan hệ.
-   **Bcrypt** và **Bcryptjs**: Thư viện để mã hóa mật khẩu.
-   **JWT (JSON Web Token)**: Thư viện để quản lý và xác thực token.
-   **Dotenv**: Thư viện để quản lý biến môi trường.
-   **Nodemailer**: Thư viện gửi email từ Node.js.
-   **Passport**: Middleware cho xác thực người dùng. Hỗ trợ nhiều chiến lược xác thực, bao gồm `passport-jwt` và `passport-local`.

Các công cụ phát triển:

-   **Babel**: Trình biên dịch JavaScript để chuyển đổi mã nguồn mới nhất thành mã tương thích với các trình duyệt cũ hơn, bao gồm `@babel/cli`, `@babel/core`, và `@babel/preset-env`.
