const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const bcrypt = require("bcryptjs");
import db from "./../models/index";

// Configure Passport to use Local Strategy
// Cấu hình Passport để sử dụng Chiến lược Local
passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            try {
                const user = await db.User.findOne({
                    where: { email: email },
                });

                if (!user) {
                    return done(null, false, {
                        errorCode: -1,
                    });
                }

                if (!user.isVerified) {
                    return done(null, false, {
                        errorCode: -3,
                    });
                }

                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    return done(null, false, {
                        errorCode: -2,
                    });
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Serialize user for session management
// Tuần tự hóa người dùng cho quản lý phiên
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
// Giải tuần tự người dùng từ phiên
passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
