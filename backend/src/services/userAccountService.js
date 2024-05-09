const nodemailer = require("nodemailer");
const { Op } = require("sequelize");
require("dotenv").config();
import createEmailTemplate from "./../template/createEmailTemplate";
import db from "./../../models/index";
import bcrypt from "bcryptjs";

// Function to hash a password
// Hàm băm mật khẩu
const hashPass = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Function to generate a verification code
// Hàm tạo mã xác minh
const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send a verification email
// Hàm gửi email xác minh
const sendVerificationEmail = async (email, verificationCode) => {
    try {
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
            html: createEmailTemplate(verificationCode),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);

        return {
            EM: "Đăng ký thành công. Vui lòng xác nhận email để hoàn tất đăng ký.",
            EC: 0,
            DT: null,
        };
    } catch (error) {
        console.error("Failed to send verification email:", error);
        return {
            EM: "Có lỗi xảy ra khi gửi email xác nhận.",
            EC: -3,
            DT: error.message,
        };
    }
};

// Function to get roles by email
// Hàm lấy vai trò bằng email
const getRolesByEmail = async (email) => {
    try {
        const user = await db.User.findOne({ where: { email } });

        if (!user) {
            return {
                EM: "Không tìm thấy người dùng!",
                EC: -1,
                DT: null,
            };
        }

        const groupWithRole = await db.Group.findOne({
            where: { id: user.groupId },
            include: [
                {
                    model: db.Role,
                    attributes: ["roleName", "permission", "description"],
                },
            ],
        });

        if (!groupWithRole || !groupWithRole.Role) {
            return {
                EM: "Không tìm thấy role cho group này!",
                EC: -1,
                DT: null,
            };
        }

        const role = {
            roleName: groupWithRole.Role.roleName,
            permission: groupWithRole.Role.permission,
            description: groupWithRole.Role.description,
        };
        return role;
    } catch (error) {
        console.log("Lỗi khi truy vấn vai trò:", error);
        return {
            EM: "Lỗi khi truy vấn vai trò.",
            EC: -1,
            DT: null,
        };
    }
};

// Function to handle user registration
// Hàm xử lý đăng ký người dùng
const handleRegisterUser = async (email, password, fullName) => {
    try {
        const verifiedUserExists = await db.User.findOne({
            where: { email, isVerified: true },
        });

        if (verifiedUserExists) {
            return {
                EM: "Email này đã được đăng ký và xác minh. Vui lòng đăng nhập.",
                EC: -1,
                DT: null,
            };
        }

        const userExists = await db.User.findOne({
            where: { email, isVerified: false },
        });

        const hash = await hashPass(password);
        const verificationCode = generateCode();

        if (userExists) {
            await userExists.update({
                password: hash,
                fullName: fullName,
                codeVery: verificationCode,
                codeCreatedAt: new Date(),
                isVerified: false,
            });

            sendVerificationEmail(email, verificationCode);

            return {
                EM: "Đăng ký thành công. Mã xác nhận mới đã được gửi.",
                EC: 0,
                DT: null,
            };
        }

        await db.User.create({
            email: email,
            password: hash,
            fullName: fullName,
            codeCreatedAt: new Date(),
            codeVery: verificationCode,
            isVerified: false,
        });

        sendVerificationEmail(email, verificationCode);

        return {
            EM: "Đăng ký thành công. Vui lòng xác nhận email để hoàn tất đăng ký.",
            EC: 0,
            DT: null,
        };
    } catch (error) {
        console.error(error);
        return {
            EM: "Lỗi hệ thống.",
            EC: -2,
            DT: error.message,
        };
    }
};

// Function to check if an email exists
// Hàm kiểm tra xem email có tồn tại hay không
const handleExistsEmail = async (email) => {
    try {
        const userExists = await db.User.findOne({ where: { email: email } });
        if (userExists) {
            return userExists;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
};

// Function to verify the registration code
// Hàm xác minh mã đăng ký
const handleVeryCodeRegister = async (code) => {
    try {
        const now = new Date();
        const tenMinutesAgo = new Date(now.getTime() - 10 * 60000);

        const user = await db.User.findOne({
            where: {
                codeVery: code,
                isVerified: false,
                codeCreatedAt: { [Op.gt]: tenMinutesAgo },
            },
        });

        if (!user) {
            return {
                success: false,
                EM: "Mã xác nhận không hợp lệ hoặc đã hết hạn.",
                EC: -1,
            };
        }

        await user.update({
            isVerified: true,
            codeVery: null,
            codeCreatedAt: null,
        });

        return {
            success: true,
            EM: "Xác thực thành công.",
            EC: 0,
        };
    } catch (error) {
        console.error("Error verifying code:", error);
        return {
            success: false,
            EM: "Lỗi cơ sở dữ liệu khi xác nhận mã.",
            EC: -2,
        };
    }
};

// Function to save verification code
// Hàm lưu mã xác minh
const handleSaveCodeVery = async (email, code) => {
    try {
        const result = await db.User.update(
            { codeVery: code, codeCreatedAt: new Date() },
            { where: { email } }
        );

        if (result[0] === 0) {
            console.log(
                "Không tìm thấy người dùng hoặc cập nhật không thành công."
            );
            return {
                EC: -1,
                EM: "Không tìm thấy người dùng hoặc cập nhật không thành công.",
            };
        }

        return { EC: 0, EM: "Cập nhật thành công." };
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    handleRegisterUser,
    getRolesByEmail,
    handleExistsEmail,
    handleSaveCodeVery,
    handleVeryCodeRegister,
};
