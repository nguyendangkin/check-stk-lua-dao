import {
    handleGetAllUsers,
    handlePostScammer,
    handleDeleteAccount,
    handleBanAccount,
} from "./../services/usersApiService";

// Fetches all users based on search keyword, limit, and offset for pagination.
// Lấy tất cả người dùng dựa trên từ khóa tìm kiếm, limit và offset cho phân trang.
const getAllUsers = async (req, res) => {
    try {
        const searchKeyword = req.query.search || "";
        const limit = parseInt(req.query.limit) || 5;
        const offset = parseInt(req.query.offset) || 0;

        const users = await handleGetAllUsers(
            searchKeyword,
            parseInt(limit),
            parseInt(offset)
        );

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
const postScammer = async (req, res) => {
    try {
        const listAccount = req.body;
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
    }
};
// Bans a user account based on userId.
// Cấm một tài khoản người dùng dựa trên userId.
const bandAccount = async (req, res) => {
    try {
        const userId = req.body.id;
        if (!userId) {
            return res.status(400).json({
                EC: -1,
                EM: "Thiếu thông tin userId để cấm tài khoản.",
            });
        }

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
        const userId = req.body.id;
        if (!userId) {
            return res
                .status(400)
                .json({ EC: 1, EM: "Thiếu thông tin userId." });
        }

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
