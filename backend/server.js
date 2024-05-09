const express = require("express");
const cors = require("cors");
const AppRoutes = require("./src/routes/AppRoute");
require("dotenv").config();
require("./config/passport");
const cron = require("node-cron");
const passport = require("passport");
const cookieParser = require("cookie-parser");
import { deleteUnverifiedAccounts } from "./job/cleanAccount";
const bodyParser = require("body-parser");
const app = express();

const port = process.env.PORT || 3006;

// Sử dụng middleware phân tích cookie
// Use cookie parser middleware
app.use(cookieParser());

// Cấu hình CORS
// Configure CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cors({
        origin: process.env.ORIGIN_URL_FRONTEND, // Cho phép yêu cầu từ nguồn này
        // Allow requests from this origin
        credentials: true,
    })
);

// Lên lịch công việc để dọn dẹp các tài khoản chưa được xác minh hàng ngày vào nửa đêm
// Schedule job to clean unverified accounts daily at midnight
cron.schedule("0 0 * * *", deleteUnverifiedAccounts, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh", // Thiết lập múi giờ phù hợp
    // Set appropriate timezone
});

// Khởi tạo passport
// Initialize passport
app.use(passport.initialize());

// Cấu hình các routes
// Configure routes
AppRoutes(app);

// Chạy ứng dụng
// Run the app
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    // Example app listening on port ${port}
});
