import {
    handleGetAllUsers,
    handlePostScammer,
    handleDeleteAccount,
    handleBanAccount,
} from "./../services/usersApiService";
import Joi from "joi";

// Fetches all users based on search keyword, limit, and offset for pagination.
// Lấy tất cả người dùng dựa trên từ khóa tìm kiếm, limit và offset cho phân trang.
const getAllUsers = async (req, res) => {
    try {
        // Extract search keyword, limit, and offset from query parameters
        // Trích xuất từ khóa tìm kiếm, giới hạn và độ lệch từ các tham số truy vấn
        const searchKeyword = req.query.search || "";
        const limit = parseInt(req.query.limit) || 5;
        const offset = parseInt(req.query.offset) || 0;

        // Fetch users using the provided parameters
        // Lấy người dùng sử dụng các tham số đã cung cấp
        const users = await handleGetAllUsers(
            searchKeyword,
            parseInt(limit),
            parseInt(offset)
        );

        // Respond with the users data if found
        // Phản hồi với dữ liệu người dùng nếu tìm thấy
        if (users) {
            return res.json({
                EC: users.EC,
                EM: users.EM,
                DT: users.DT,
                totalUsers: users.totalUsers,
            });
        } else {
            return res.json({
                EC: 1,
                EM: "Không tìm thấy người dùng.",
                DT: [],
            });
        }
    } catch (error) {
        console.log(error);
        return res.json({
            EC: 1,
            EM: "Lỗi khi lấy dữ liệu.",
            DT: [],
        });
    }
};

// Adds a list of scammer accounts to the database.
// Thêm một danh sách tài khoản lừa đảo vào cơ sở dữ liệu.
// Định nghĩa schema cho account
const accountSchema = Joi.object({
    accountNumber: Joi.string()
        .pattern(/^\d+$/, "numbers")
        .required()
        .messages({
            "string.pattern.name": "Số Tài Khoản chỉ chứa số",
            "string.empty": "Số Tài Khoản là bắt buộc",
        }),
    accountName: Joi.string()
        .pattern(/^[a-zA-Z\s]+$/, "letters")
        .required()
        .messages({
            "string.pattern.name":
                "Tên Chủ Tài Khoản chỉ chứa chữ cái không dấu",
            "string.empty": "Tên Chủ Tài Khoản là bắt buộc",
        }),
    bankName: Joi.string()
        .pattern(/^[a-zA-Z\s]+$/, "letters")
        .required()
        .messages({
            "string.pattern.name":
                "Tên Hệ Thống Thanh Toán chỉ chứa chữ cái không dấu",
            "string.empty": "Tên Hệ Thống Thanh Toán là bắt buộc",
        }),
    evidenceLink: Joi.string().uri().required().messages({
        "string.uri": "Link minh chứng không hợp lệ",
        "string.empty": "Link minh chứng là bắt buộc",
    }),
    advice: Joi.string().required().messages({
        "string.empty": "Lời khuyên là bắt buộc",
    }),
});

// Định nghĩa schema cho listAccount
const listAccountSchema = Joi.object({
    accounts: Joi.array().items(accountSchema).required().messages({
        "array.base": "Danh sách tài khoản phải là một mảng",
        "array.includes": "Mỗi tài khoản phải là một đối tượng hợp lệ",
        "any.required": "Danh sách tài khoản là bắt buộc",
    }),
    userId: Joi.number().integer().required().messages({
        "number.base": "User ID phải là số nguyên",
        "any.required": "User ID là bắt buộc",
    }),
});

// Adds a list of scammer accounts to the database.
// Thêm một danh sách tài khoản lừa đảo vào cơ sở dữ liệu.
const postScammer = async (req, res) => {
    try {
        // Trích xuất danh sách tài khoản từ request body
        const listAccount = req.body;

        // Valid danh sách tài khoản
        const { error } = listAccountSchema.validate(listAccount, {
            abortEarly: false,
        });

        if (error) {
            return res.status(400).json({
                EC: -1,
                EM: "Validation Lỗi",
                DT: error.details.map((err) => err.message),
            });
        }

        // Gọi hàm để xử lý và lưu thông tin lừa đảo
        const data = await handlePostScammer(listAccount);

        if (data) {
            return res.json({
                EC: data.EC,
                EM: data.EM,
                DT: null,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: -1,
            EM: "Server Lỗi",
        });
    }
};
// Bans a user account based on userId.
// Cấm một tài khoản người dùng dựa trên userId.
const bandAccount = async (req, res) => {
    try {
        // Extract userId from the request body
        // Trích xuất userId từ nội dung yêu cầu
        const userId = req.body.id;

        if (!userId) {
            return res.status(400).json({
                EC: -1,
                EM: "Thiếu thông tin userId để cấm tài khoản.",
            });
        }

        // Call function to ban the user account
        // Gọi hàm để cấm tài khoản người dùng
        const result = await handleBanAccount(userId);

        return res.json({
            EC: result.EC,
            EM: result.EM,
        });
    } catch (error) {
        console.log("Lỗi server:", error);
        return res.status(500).json({
            EC: 1,
            EM: "Lỗi server khi cố gắng cấm tài khoản.",
        });
    }
};

// Deletes a user account based on userId.
// Xóa một tài khoản người dùng dựa trên userId.
const deleteAccount = async (req, res) => {
    try {
        // Retrieves the userId from the request body.
        // Lấy userId từ body của request.
        const userId = req.body.id;
        if (!userId) {
            return res
                .status(400)
                .json({ EC: 1, EM: "Thiếu thông tin userId." });
        }

        // Calls the handleDeleteAccount function to handle the actual account deletion.
        // Gọi hàm handleDeleteAccount để xử lý việc xóa tài khoản thực tế.
        const result = await handleDeleteAccount(userId);

        return res.json({
            EC: result.EC,
            EM: result.EM,
        });
    } catch (error) {
        console.log("Lỗi server:", error);
        return res
            .status(500)
            .json({ EC: 1, EM: "Lỗi server khi xóa tài khoản." });
    }
};

module.exports = {
    getAllUsers,
    postScammer,
    bandAccount,
    deleteAccount,
};
