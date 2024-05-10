import { deleteUnverifiedAccounts } from "./job/cleanAccount";
require("dotenv").config();
require("./config/passport");
const express = require("express");
const cors = require("cors");
const AppRoutes = require("./src/routes/AppRoute");
const cron = require("node-cron");
const passport = require("passport");
const cookieParser = require("cookie-parser");
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
        // Cho phép yêu cầu từ nguồn này
        // Allow requests from this origin
        origin: process.env.ORIGIN_URL_FRONTEND,
        credentials: true,
    })
);

// Lên lịch công việc để dọn dẹp các tài khoản chưa được xác minh hàng ngày vào nửa đêm
// Schedule job to clean unverified accounts daily at midnight
cron.schedule("0 0 * * *", deleteUnverifiedAccounts, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh",
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
});
