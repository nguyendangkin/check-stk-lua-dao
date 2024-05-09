const jwt = require("jsonwebtoken");
const db = require("./../../models/index");
require("dotenv").config();

// Verifies the refresh token, fetches the user and their roles, and generates a new access token if valid.
// Xác minh refresh token, lấy thông tin người dùng và vai trò của họ, và tạo ra một access token mới nếu hợp lệ.
const refreshAccessToken = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        const user = await db.User.findOne({
            where: { id: decoded.id },
        });

        const groupWithRole = await db.Group.findOne({
            where: { id: user.groupId },
            include: [
                {
                    model: db.Role,
                    attributes: ["roleName", "permission", "description"],
                },
            ],
        });

        const roles = {
            roleName: groupWithRole.Role.roleName,
            permission: groupWithRole.Role.permission,
            description: groupWithRole.Role.description,
        };

        if (user) {
            return jwt.sign(
                { id: user.id, email: user.email, roles },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRATION_TIME }
            );
        }
    } catch (error) {
        console.log("Lỗi làm mới token:", error);
        return null;
    }
};

// Middleware to authenticate user by verifying the access token and refreshing it if expired.
// Middleware xác thực người dùng bằng cách xác minh access token và làm mới nó nếu hết hạn.
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];

        const refreshToken = req.cookies.refreshToken;

        if (!authHeader || !refreshToken) {
            return res.status(401).json({
                EM: "Thiếu token xác thực hoặc refresh token.",
                EC: -1,
            });
        }

        const accessToken = authHeader.split(" ")[1];

        jwt.verify(
            accessToken,
            process.env.JWT_SECRET,
            async (err, decoded) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        const newAccessToken = await refreshAccessToken(
                            refreshToken
                        );

                        if (newAccessToken) {
                            req.headers[
                                "authorization"
                            ] = `Bearer ${newAccessToken}`;
                            return next();
                        } else {
                            return res.status(401).json({
                                EM: "Không thể làm mới access token.",
                            });
                        }
                    } else {
                        return res.status(401).json({
                            EM: "Token xác thực không hợp lệ.",
                            EC: -1,
                        });
                    }
                } else {
                    req.user = decoded;
                    return next();
                }
            }
        );
    } catch (error) {
        console.log("Lỗi xác thực:", error);
        return res.status(500).json({ EM: "Lỗi xác thực." });
    }
};

// Middleware to authorize user based on their roles. Checks if user has required roles to access a resource.
// Middleware phân quyền người dùng dựa trên vai trò của họ. Kiểm tra xem người dùng có vai trò cần thiết để truy cập tài nguyên không.
export const authorize = (requiredRoles) => {
    return (req, res, next) => {
        const authHeader = req.headers["authorization"];

        if (!authHeader) {
            return res.status(401).json({ EM: "Thiếu token xác thực." });
        }

        const accessToken = authHeader.split(" ")[1];

        jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res
                    .status(401)
                    .json({ EM: "Token xác thực không hợp lệ." });
            }

            const userRole = decoded.roles;

            const hasRequiredRole = requiredRoles.includes(userRole.roleName);

            if (hasRequiredRole) {
                req.user = decoded;
                return next();
            } else {
                return res.status(403).json({
                    EM: "Bạn không có quyền truy cập tài nguyên này.",
                });
            }
        });
    };
};
