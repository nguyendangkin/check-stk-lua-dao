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
    const { code } = req.body;
    try {
        const result = await handleVeryCodeRegister(code);
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
        const { email } = req.body;

        const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            return res.json({ EC: -2, EM: "Email không đúng định dạng." });
        }

        const userExists = await handleExistsEmail(email);
        if (!userExists) {
            return res.json({
                EC: -1,
                EM: "Email không tồn tại trong hệ thống.",
            });
        }

        const code = generateCode();

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: `Check STK Lừa Đảo <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Mã Xác Thực",
            html: createEmailTemplate(code),
        };

        await transporter.sendMail(mailOptions);
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
        const schema = Joi.object({
            email: Joi.string().email().required(),
            fullName: Joi.string().min(1).required(),
            password: Joi.string().min(6).required(),
            confirmPassword: Joi.string().required(),
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.json({
                EM: "Dữ liệu không hợp lệ.",
                EC: -1,
                DT: error.details,
            });
        }

        const { email, fullName, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.json({
                EM: "Mật khẩu và Xác nhận Mật khẩu không trùng khớp.",
                EC: -2,
                DT: [],
            });
        }

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
        if (err) {
            return res.json({
                EC: -1,
                EM: "Tài khoảng hoặc mật khẩu không đúng.",
                DT: null,
            });
        }

        if (!user) {
            return res.json({
                EC: -1,
                EM: "Tài khoảng hoặc mật khẩu không đúng.",
                DT: null,
            });
        }

        req.logIn(user, async (err) => {
            if (err) {
                return res.json({
                    EC: -1,
                    EM: "Tài khoảng hoặc mật khẩu không đúng.",
                    DT: null,
                });
            }

            const roles = await getRolesByEmail(user.email);

            const accessToken = createAccessToken(user, roles);
            const refreshToken = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
                }
            );

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                // secure: true, // Chỉ gửi cookie qua HTTPS
                sameSite: "Strict",
            });

            return res.json({
                EC: 0,
                EM: "Đăng nhập thành công.",
                DT: {
                    accessToken: accessToken,
                    fullName: user.fullName,
                    email: user.email,
                },
            });
        });
    })(req, res, next);
};

// Handles user logout. Clears cookies and session information.
// Xử lý đăng xuất cho người dùng. Xóa cookies và thông tin phiên làm việc.
const userLogout = (req, res) => {
    try {
        req.logout((err) => {
            if (err) {
                console.error("Lỗi trong quá trình đăng xuất:", err);
                return res.status(500).json({
                    EC: -1,
                    EM: "Đã xảy ra lỗi trong quá trình đăng xuất.",
                    DT: null,
                });
            }

            res.clearCookie("refreshToken");

            return res.json({
                EC: 0,
                EM: "Đăng xuất thành công.",
                DT: null,
            });
        });
    } catch (error) {
        console.log(error);
    }
};

// Allows users to reset their password. Checks verification code, compares new password and confirmation password.
// If valid, updates the new password in the database.
// Cho phép người dùng thiết lập lại mật khẩu. Kiểm tra mã xác thực, so sánh mật khẩu mới và xác nhận mật khẩu.
// Nếu hợp lệ, cập nhật mật khẩu mới vào cơ sở dữ liệu.
const passRetri = async (req, res) => {
    try {
        const { email, code, newPassword, confirmPassword } = req.body;

        const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            return res.json({ EC: -2, EM: "Email không đúng định dạng." });
        }

        const user = await handleExistsEmail(email);
        if (!user) {
            return res.json({ EC: -1, EM: "Email không tồn tại." });
        }

        const storedCode = user.codeVery;
        const codeCreatedAt = user.codeCreatedAt;

        const currentTime = new Date();
        const timeDiff = (currentTime - new Date(codeCreatedAt)) / (60 * 1000);

        if (!storedCode || storedCode != code || timeDiff > 10) {
            await user.update({ codeVery: null, codeCreatedAt: null });
            return res.json({
                EC: -1,
                EM: "Mã xác thực không khớp hoặc đã hết hạn!",
            });
        }

        if (!newPassword) {
            return res.json({ EC: -4, EM: "Mật khẩu không được bỏ trống." });
        }

        if (newPassword.length < 6) {
            return res.json({
                EC: -3,
                EM: "Mật khẩu phải có ít nhất 6 ký tự.",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.json({ EC: -4, EM: "Mật khẩu không trùng khớp." });
        }

        const hash = await hashPass(newPassword);
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
