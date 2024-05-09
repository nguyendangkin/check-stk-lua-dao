const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const bcrypt = require("bcryptjs");
import db from "./../models/index";

// Cấu hình Passport để sử dụng Chiến lược Local
// Configure Passport to use Local Strategy
passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            try {
                // Tìm người dùng bằng email
                // Find user by email
                const user = await db.User.findOne({
                    where: { email: email },
                });

                // Nếu không tìm thấy người dùng
                // If user is not found
                if (!user) {
                    return done(null, false, {
                        errorCode: -1,
                    });
                }

                // Nếu người dùng chưa được xác minh
                // If user is not verified
                if (!user.isVerified) {
                    return done(null, false, {
                        errorCode: -3,
                    });
                }

                // So sánh mật khẩu được cung cấp với hash được lưu trữ
                // Compare the provided password with the stored hash
                const isMatch = await bcrypt.compare(password, user.password);

                // Nếu mật khẩu không khớp
                // If password does not match
                if (!isMatch) {
                    return done(null, false, {
                        errorCode: -2,
                    });
                }

                // Xác thực thành công, trả về người dùng
                // Successful authentication, return user
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);
