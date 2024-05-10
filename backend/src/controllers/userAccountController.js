import {
    handleRegisterUser,
    getRolesByEmail,
    handleExistsEmail,
    handleSaveCodeVery,
    handleVeryCodeRegister,
} from "./../services/userAccountService";
import createEmailTemplate from "./../template/createEmailTemplate";
import bcrypt from "bcryptjs";
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const passport = require("passport");

// Hashes a password using bcrypt with a randomly generated salt.
// Hàm này tạo một mã hash cho mật khẩu sử dụng bcrypt, nó tạo ra một "salt" ngẫu nhiên và sau đó hash mật khẩu.
const hashPass = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Generates a random 6-digit verification code.
// Sinh ra một mã ngẫu nhiên 6 chữ số. Mã này có thể được sử dụng cho các mục đích xác thực.
const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Creates a JWT access token containing user's ID, email, and roles with an expiration time set in the environment variables.
// Tạo ra một access token JWT, chứa ID người dùng, email, và vai trò. Token này có hạn sử dụng được xác định trong biến môi trường.
const createAccessToken = (user, roles) => {
    return jwt.sign(
        { id: user.id, email: user.email, roles },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION_TIME }
    );
};

// Handles the code verification request during registration. Returns success if the code is valid, otherwise returns an error.
// Xử lý yêu cầu xác thực mã khi đăng ký. Nếu mã hợp lệ, trả về thành công, ngược lại trả về lỗi.
const veryCodeRegister = async (req, res) => {
    // Extract code from the request body
    // Trích xuất mã từ nội dung yêu cầu
    const { code, email } = req.body;
    try {
        // Call the function to handle code verification
        // Gọi hàm để xử lý xác minh mã
        const result = await handleVeryCodeRegister(code, email);

        // If verification is successful, send a success response
        // Nếu xác minh thành công, gửi phản hồi thành công
        if (result.success) {
            return res.json({
                EM: "Xác nhận email thành công.",
                EC: 0,
                DT: null,
            });
        } else {
            return res.json({
                EM: result.EM,
                EC: result.EC,
                DT: null,
            });
        }
    } catch (error) {
        console.error("Error during code verification:", error);
        return res.status(500).json({
            EM: "Có lỗi xảy ra khi xác minh mã.",
            EC: -2,
            DT: error.message,
        });
    }
};

// Sends a verification code email to the user. Validates email format, checks if email exists in the system, and sends the code.
// Uses nodemailer for sending emails and saves the code to the database.
// Gửi email với mã xác thực tới người dùng. Kiểm tra định dạng email, kiểm tra email có tồn tại trong hệ thống không và gửi mã.
// Sử dụng nodemailer để gửi mail và lưu mã vào cơ sở dữ liệu.
const sendCodeEmail = async (req, res) => {
    try {
        // Extract email from the request body
        // Trích xuất email từ nội  request body
        const { email } = req.body;

        // Regular expression to validate email format
        // Biểu thức chính quy để xác thực định dạng email
        const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            return res.json({ EC: -2, EM: "Email không đúng định dạng." });
        }

        // Check if email exists in the system
        // Kiểm tra email có tồn tại trong hệ thống không
        const userExists = await handleExistsEmail(email);
        if (!userExists) {
            return res.json({
                EC: -1,
                EM: "Email không tồn tại trong hệ thống.",
            });
        }

        // Generate a random verification code
        // Tạo mã xác thực ngẫu nhiên
        const code = generateCode();

        // Set up email transporter configuration
        // Cấu hình gửi email
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Define email options
        // Định nghĩa các tùy chọn email
        const mailOptions = {
            from: `Check STK Lừa Đảo <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Mã Xác Thực",
            html: createEmailTemplate(code),
        };

        // Send the email
        // Gửi email
        await transporter.sendMail(mailOptions);

        // Save the verification code in the system
        // Lưu mã xác thực trong hệ thống
        await handleSaveCodeVery(email, code);

        return res.json({ EC: 0, EM: "Mã đã được gửi thành công." });
    } catch (error) {
        console.log(error);
        return res.json({ EC: -3, EM: "Có lỗi xảy ra khi gửi mã." });
    }
};

// Registers a new user. Validates the input data, checks if the password and confirmation password match.
// Proceeds with user registration if valid.
// Đăng ký người dùng mới. Kiểm tra dữ liệu đầu vào, xác minh mật khẩu và xác nhận mật khẩu có trùng khớp không.
// Nếu hợp lệ, tiến hành đăng ký người dùng.
const userRegister = async (req, res) => {
    try {
        // Define validation schema using Joi
        // Định nghĩa lược đồ xác thực bằng Joi
        const schema = Joi.object({
            email: Joi.string().email().required(),
            fullName: Joi.string().min(1).max(23).required(),
            password: Joi.string().min(6).required(),
            confirmPassword: Joi.string().required(),
        });

        // Validate the request body against the schema
        // Xác thực nội dung yêu cầu theo lược đồ
        const { error } = schema.validate(req.body);
        if (error) {
            return res.json({
                EM: "Dữ liệu không hợp lệ.",
                EC: -1,
                DT: error.details,
            });
        }

        // Destructure validated fields from request body
        // Tách các trường đã xác thực từ request body
        const { email, fullName, password, confirmPassword } = req.body;

        // Check if password and confirm password match
        // Kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp không
        if (password !== confirmPassword) {
            return res.json({
                EM: "Mật khẩu và Xác nhận Mật khẩu không trùng khớp.",
                EC: -2,
                DT: [],
            });
        }

        // Call function to handle user registration
        // Gọi hàm để xử lý đăng ký người dùng
        const registrationResult = await handleRegisterUser(
            email,
            password,
            fullName
        );

        return res.json({
            EM: registrationResult.EM,
            EC: registrationResult.EC,
            DT: [],
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: "Lỗi hệ thống",
            EC: -2,
            DT: error.message,
        });
    }
};

// Handles user login. Uses Passport.js for authentication and generates tokens for the session.
// Returns tokens and user info if login is successful.
// Xử lý đăng nhập cho người dùng. Sử dụng Passport.js để xác thực và tạo token cho phiên đăng nhập.
// Trả về token và thông tin người dùng nếu đăng nhập thành công.
const userLogin = (req, res, next) => {
    passport.authenticate("local", async (err, user) => {
        // Respond with error if authentication fails
        // Phản hồi lỗi nếu xác thực thất bại
        if (err) {
            return res.json({
                EC: -1,
                EM: "Tài khoản hoặc mật khẩu không đúng.",
                DT: null,
            });
        }

        // Respond with error if user is not found
        // Phản hồi lỗi nếu không tìm thấy người dùng
        if (!user) {
            return res.json({
                EC: -1,
                EM: "Tài khoản hoặc mật khẩu không đúng.",
                DT: null,
            });
        }

        try {
            // Get user roles
            // Lấy vai trò người dùng
            const roles = await getRolesByEmail(user.email);

            // Create access token
            // Tạo access token
            const accessToken = createAccessToken(user, roles);

            // Create refresh token
            // Tạo refresh token
            const refreshToken = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
                }
            );

            // Set refresh token in cookie
            // Đặt refresh token trong cookie
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                sameSite: "Strict",
                // secure: true, // Uncomment if using HTTPS // Bỏ chú thích nếu sử dụng HTTPS
            });

            // Respond with access token and user details
            // Phản hồi với access token và thông tin người dùng
            return res.json({
                EC: 0,
                EM: "Đăng nhập thành công.",
                DT: {
                    accessToken: accessToken,
                    fullName: user.fullName,
                    email: user.email,
                },
            });
        } catch (error) {
            return res.json({
                EC: -1,
                EM: "Lỗi hệ thống trong quá trình đăng nhập.",
                DT: null,
            });
        }
    })(req, res, next);
};

// Handles user logout. Clears cookies and session information.
// Xử lý đăng xuất cho người dùng. Xóa cookies và thông tin phiên làm việc.
const userLogout = (req, res) => {
    try {
        // Clear the refresh token cookie
        // Xóa cookie refresh token
        res.clearCookie("refreshToken");

        return res.json({
            EC: 0,
            EM: "Đăng xuất thành công.",
            DT: null,
        });
    } catch (error) {
        console.error("Lỗi trong quá trình đăng xuất:", error);
        return res.status(500).json({
            EC: -1,
            EM: "Đã xảy ra lỗi trong quá trình đăng xuất.",
            DT: null,
        });
    }
};

// Allows users to reset their password. Checks verification code, compares new password and confirmation password.
// If valid, updates the new password in the database.
// Cho phép người dùng thiết lập lại mật khẩu. Kiểm tra mã xác thực, so sánh mật khẩu mới và xác nhận mật khẩu.
// Nếu hợp lệ, cập nhật mật khẩu mới vào cơ sở dữ liệu.
const passRetri = async (req, res) => {
    try {
        // Extract necessary fields from the request body
        // Trích xuất các trường cần thiết từ request body
        const { email, code, newPassword, confirmPassword } = req.body;
        const trimmedEmail = email.trim();
        const trimmedCode = code.trim();
        const trimmedNewPassword = newPassword.trim();
        const trimmedConfirmPassword = confirmPassword.trim();

        // Regular expression to validate email format
        // Biểu thức chính quy để xác thực định dạng email
        const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(trimmedEmail)) {
            return res.json({ EC: -2, EM: "Email không đúng định dạng." });
        }

        // Check if the email exists in the system
        // Kiểm tra xem email có tồn tại trong hệ thống không
        const user = await handleExistsEmail(trimmedEmail);
        if (!user) {
            return res.json({ EC: -1, EM: "Email không tồn tại." });
        }

        // Retrieve stored verification code and its creation time
        // Lấy mã xác thực đã lưu và thời gian tạo mã
        const storedCode = user.codeVery;
        const codeCreatedAt = user.codeCreatedAt;

        // Calculate time difference between now and code creation time
        // Tính toán sự khác biệt thời gian giữa bây giờ và thời gian tạo mã
        const currentTime = new Date();
        const timeDiff = (currentTime - new Date(codeCreatedAt)) / (60 * 1000);

        // Validate the verification code and its expiry
        // Xác thực mã xác thực và thời hạn của nó
        if (!storedCode || storedCode !== trimmedCode || timeDiff > 10) {
            await user.update({ codeVery: null, codeCreatedAt: null });
            return res.json({
                EC: -1,
                EM: "Mã xác thực không khớp hoặc đã hết hạn!",
            });
        }

        // Check if new password is provided
        // Kiểm tra xem mật khẩu mới có được cung cấp không
        if (!trimmedNewPassword) {
            return res.json({ EC: -4, EM: "Mật khẩu không được bỏ trống." });
        }

        // Validate the length of the new password
        // Xác thực độ dài của mật khẩu mới
        if (trimmedNewPassword.length < 6) {
            return res.json({
                EC: -3,
                EM: "Mật khẩu phải có ít nhất 6 ký tự.",
            });
        }

        // Check if new password matches confirm password
        // Kiểm tra xem mật khẩu mới có khớp với mật khẩu xác nhận không
        if (trimmedNewPassword !== trimmedConfirmPassword) {
            return res.json({ EC: -4, EM: "Mật khẩu không trùng khớp." });
        }

        // Hash the new password
        // Băm mật khẩu mới
        const hash = await hashPass(trimmedNewPassword);

        // Update user's password and reset code information
        // Cập nhật mật khẩu của người dùng và đặt lại thông tin mã
        await user.update({
            password: hash,
            codeVery: null,
            codeCreatedAt: null,
        });

        return res.json({
            EM: "Mật khẩu đã được cập nhật thành công.",
            EC: 0,
        });
    } catch (error) {
        console.log(error);
        return res.json({ EC: -4, EM: "Có lỗi xảy ra khi đổi mật khẩu." });
    }
};

module.exports = {
    userRegister,
    userLogin,
    userLogout,
    passRetri,
    sendCodeEmail,
    veryCodeRegister,
};
