const express = require("express");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./config/passport");
const AppRoutes = require("./src/routes/AppRoute");
const cron = require("node-cron");
const passport = require("passport");
const bodyParser = require("body-parser");
const app = express();
import { deleteUnverifiedAccounts } from "./job/cleanAccount";

const port = process.env.PORT || 3006;

// Configure express session
// Cấu hình phiên express
app.use(
    session({
        secret: process.env.SECRET_EXPRESS_SESSION,
        resave: false,
        saveUninitialized: false,
    })
);
// Use cookie parser middleware
// Sử dụng middleware phân tích cookie
app.use(cookieParser());

// Configure CORS
// Cấu hình CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cors({
        origin: process.env.ORIGIN_URL_FRONTEND,
        credentials: true,
    })
);

// Schedule job to clean unverified accounts daily at midnight
// Lên lịch công việc để dọn dẹp các tài khoản chưa được xác minh hàng ngày vào nửa đêm
cron.schedule("0 0 * * *", deleteUnverifiedAccounts, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh",
});

// Initialize passport
// Khởi tạo passport
app.use(passport.initialize());
app.use(passport.session());

// Configure routes
// Cấu hình routes
AppRoutes(app);

// Run the app
// Chạy ứng dụng
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
