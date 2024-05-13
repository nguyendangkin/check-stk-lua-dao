const userAccountController = require("./../controllers/userAccountController");
import userApiController from "./../controllers/usersApiController";
import postsApiController from "./../controllers/postsApiController";
import { authenticate, authorize } from "./../middleware/auth";
const express = require("express");
const router = express.Router();

// Function to define and initialize all application routes
// Hàm định nghĩa và khởi tạo tất cả các route của ứng dụng
const AppRoutes = (app) => {
    // Route to handle user registration
    // Route xử lý đăng ký người dùng
    router.post("/register", userAccountController.userRegister);
    // Route to handle code verification during registration
    // Route xử lý xác minh mã khi đăng ký

    router.post(
        "/verify-code-register",
        userAccountController.veryCodeRegister
    );

    // Route to handle user login
    // Route xử lý đăng nhập người dùng
    router.post("/login", userAccountController.userLogin);

    // Route to handle user logout
    // Route xử lý đăng xuất người dùng
    router.post("/logout", userAccountController.userLogout);

    // Route to handle password retrieval
    // Route xử lý khôi phục mật khẩu
    router.post("/pass-retri", userAccountController.passRetri);

    // Route to handle sending verification code via email
    // Route xử lý gửi mã xác thực qua email
    router.post("/send-code-email", userAccountController.sendCodeEmail);

    // Route to get all users, accessible only by admin
    // Route để lấy tất cả người dùng, chỉ truy cập bởi admin
    router.get(
        "/get-all-users",
        authenticate,
        authorize(["admin"]),
        userApiController.getAllUsers
    );

    // Route to ban a user account, accessible only by admin
    // Route để cấm tài khoản người dùng, chỉ truy cập bởi admin
    router.post(
        "/ban-account",
        authenticate,
        authorize(["admin"]),
        userApiController.bandAccount
    );

    // Route to delete a user account, accessible only by admin
    // Route để xóa tài khoản người dùng, chỉ truy cập bởi admin
    router.post(
        "/delete-account",
        authenticate,
        authorize(["admin"]),
        userApiController.deleteAccount
    );

    // Route to post a scammer report, accessible by user and admin
    // Route để đăng báo cáo lừa đảo, truy cập bởi người dùng và admin
    router.post(
        "/post-scam",
        authenticate,
        authorize(["user", "admin"]),
        userApiController.postScammer
    );

    // Route to get all posts
    // Route để lấy tất cả bài đăng
    router.get("/get-all-posts", postsApiController.getAllPosts);

    // Route to get a specific post
    // Route để lấy một bài đăng cụ thể
    router.post("/get-post", postsApiController.getPost);

    // Route to get comments of a post
    // Route để lấy các bình luận của một bài đăng
    router.post("/get-comment", postsApiController.getComment);

    //
    router.post(
        "/get-info-user",
        authenticate,
        authorize(["admin"]),
        postsApiController.getInfoUser
    );

    router.post(
        "/delete-post",
        authenticate,
        authorize(["admin"]),
        postsApiController.deletePost
    );

    router.post(
        "/delete-comment",
        authenticate,
        authorize(["admin"]),
        postsApiController.deleteComment
    );

    // Route to handle all unspecified routes with a 404 message
    // Route xử lý tất cả các tuyến đường không xác định với thông báo 404
    router.get("*", (req, res) => {
        res.send("404 Page Not Found");
    });

    // Use the defined routes under the "/api/v1" path
    // Sử dụng routes đã định nghĩa dưới đường dẫn "/api/v1"
    app.use("/api/v1", router);
};

module.exports = AppRoutes;
