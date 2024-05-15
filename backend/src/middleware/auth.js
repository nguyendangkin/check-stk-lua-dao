const jwt = require("jsonwebtoken");
const db = require("./../../models/index");
require("dotenv").config();

// Verifies the refresh token, fetches the user and their roles, and generates a new access token if valid.
// Xác minh refresh token, lấy thông tin người dùng và vai trò của họ, và tạo ra một access token mới nếu hợp lệ.
const refreshAccessToken = async (refreshToken) => {
    try {
        // Verifies the refresh token using the JWT secret.
        // Kiểm tra tính hợp lệ của refresh token bằng JWT secret.
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        // Fetches the user information from the database based on the decoded user ID.
        // Lấy thông tin người dùng từ database dựa trên ID giải mã từ refresh token.
        const user = await db.User.findOne({
            where: { id: decoded.id },
        });

        // Fetches the group and associated role information for the user.
        // Lấy thông tin nhóm và quyền liên quan cho người dùng.
        const groupWithRole = await db.Group.findOne({
            where: { id: user.groupId },
            include: [
                {
                    model: db.Role,
                    attributes: ["roleName", "permission", "description"],
                },
            ],
        });

        // Extracts the role information from the group and role data.
        // Trích xuất thông tin quyền từ dữ liệu nhóm và quyền.
        const roles = {
            roleName: groupWithRole.Role.roleName,
            permission: groupWithRole.Role.permission,
            description: groupWithRole.Role.description,
        };

        // Checks if the user was found.
        // Kiểm tra xem người dùng có được tìm thấy không.
        // Creates a new access token with user information and roles if the user exists.
        // Tạo access token mới với thông tin người dùng và quyền nếu người dùng tồn tại.
        if (user) {
            return jwt.sign(
                { id: user.id, email: user.email, roles },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRATION_TIME }
            );
        } else {
            return null;
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
        // Attempts to retrieve the authorization header and refresh token from the request.
        // Cố gắng lấy authorization header và refresh token từ request.
        const authHeader = req.headers["authorization"];

        // Checks if both access token and refresh token are present.
        // Kiểm tra xem cả access token và refresh token đều có hay không.
        const refreshToken = req.cookies.refreshToken;

        // Returns an error response if either token is missing.
        // Trả về response lỗi nếu thiếu một trong hai token.
        if (!authHeader || !refreshToken) {
            return res.status(401).json({
                EM: "Thiếu token xác thực hoặc refresh token.",
                EC: -2,
            });
        }

        // Extracts the access token from the authorization header.
        // Trích xuất access token từ authorization header.
        const accessToken = authHeader.split(" ")[1];

        // Verifies the access token using the JWT secret.
        // Kiểm tra tính hợp lệ của access token bằng JWT secret.
        jwt.verify(
            accessToken,
            process.env.JWT_SECRET,
            async (err, decoded) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        // If the error is a TokenExpiredError, attempts to refresh the access token.
                        // Nếu lỗi là TokenExpiredError, hãy thử làm mới access token.
                        const newAccessToken = await refreshAccessToken(
                            refreshToken
                        );

                        if (newAccessToken) {
                            // If refresh is successful, updates the authorization header with the new token.
                            // Nếu làm mới thành công, cập nhật authorization header với token mới.
                            req.headers[
                                "authorization"
                            ] = `Bearer ${newAccessToken}`;
                            return next();
                        } else {
                            return res.status(401).json({
                                EM: "Không thể làm mới access token.",
                                EC: -2,
                            });
                        }
                    } else {
                        return res.status(401).json({
                            EM: "Token xác thực không hợp lệ.",
                            EC: -2,
                        });
                    }
                } else {
                    // If verification is successful, attaches the decoded user information to the request.
                    // Nếu xác minh thành công, đính kèm thông tin người dùng giải mã vào request.
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
    // Returns a closure that acts as the middleware function.
    // Trả về một closure hoạt động như một hàm middleware.
    return (req, res, next) => {
        // Attempts to retrieve the authorization header from the request.
        // Cố gắng lấy authorization header từ request.
        const authHeader = req.headers["authorization"];

        // Returns an error response if the authorization header is missing.
        // Trả về response lỗi nếu thiếu authorization header.
        if (!authHeader) {
            return res.status(401).json({ EM: "Thiếu token xác thực." });
        }

        // Extracts the access token from the authorization header.
        // Trích xuất access token từ authorization header.
        const accessToken = authHeader.split(" ")[1];

        // Verifies the access token using the JWT secret.
        // Kiểm tra tính hợp lệ của access token bằng JWT secret.
        jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
            // Returns an error response if the access token is invalid.
            // Trả về response lỗi nếu access token không hợp lệ.
            if (err) {
                return res
                    .status(401)
                    .json({ EM: "Token xác thực không hợp lệ." });
            }

            // Extracts the user's role from the decoded information.
            // Trích xuất vai trò của người dùng từ thông tin giải mã.
            const userRole = decoded.roles;

            // Checks if the user's role is included in the required roles list.
            // Kiểm tra xem vai trò của người dùng có nằm trong danh sách các vai trò được yêu cầu không.
            const hasRequiredRole = requiredRoles.includes(userRole.roleName);

            if (hasRequiredRole) {
                // Attaches the decoded user information to the request if authorized.
                // Đính kèm thông tin người dùng giải mã vào request nếu được ủy quyền.
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
