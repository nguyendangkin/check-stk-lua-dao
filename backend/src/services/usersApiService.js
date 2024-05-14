const { Sequelize, Op } = require("sequelize");
import db from "./../../models/index";

// Function to normalize Vietnamese strings by removing diacritics and converting to uppercase
// Hàm chuẩn hóa chuỗi tiếng Việt bằng cách loại bỏ dấu và chuyển sang chữ hoa
const normalizeVietnamese = (str) => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toUpperCase();
};

// Function to handle retrieving all users with optional search, pagination
// Hàm xử lý lấy tất cả người dùng với tìm kiếm tùy chọn, phân trang
const handleGetAllUsers = async (searchKeyword, limit, offset) => {
    try {
        // Fetch users based on search keyword, limit, and offset
        // Lấy người dùng dựa trên từ khóa tìm kiếm, limit và offset
        const users = await db.User.findAll({
            // Search users by email
            // Tìm kiếm người dùng bằng email
            where: searchKeyword && {
                email: { [Sequelize.Op.iLike]: `%${searchKeyword}%` },
            },
            attributes: ["id", "email", "fullName", "groupId"],

            limit: limit,
            offset: offset,
        });

        // Count total users based on search keyword
        // Đếm tổng số người dùng dựa trên từ khóa tìm kiếm
        const totalUsers = await db.User.count({
            // Count users by email
            // Đếm người dùng bằng email
            where: searchKeyword && {
                email: { [Sequelize.Op.iLike]: `%${searchKeyword}%` },
            },
        });

        if (users) {
            return {
                EM: "Lấy tất cả người dùng thành công.",
                EC: 0,
                DT: users,
                totalUsers: totalUsers,
            };
        }
    } catch (error) {
        console.error("Error in handleGetAllUsers:", error);
        return {
            EM: "Lỗi khi lấy dữ liệu người dùng.",
            EC: 1,
            DT: [],
        };
    }
};

// Function to handle posting a list of scammer accounts with transaction handling
// Hàm xử lý đăng danh sách tài khoản lừa đảo với xử lý giao dịch
const handlePostScammer = async (listAccount) => {
    // Start a new transaction
    const transaction = await db.sequelize.transaction();

    try {
        // Normalize Vietnamese characters in account details
        listAccount.accounts = listAccount.accounts.map((account) => ({
            ...account,
            accountNumber: normalizeVietnamese(account.accountNumber),
            accountName: normalizeVietnamese(account.accountName),
            bankName: normalizeVietnamese(account.bankName),
        }));

        const { accounts, userId } = listAccount;

        // Iterate through each account
        for (const account of accounts) {
            // Find or create a new post for each account
            const [post, created] = await db.Post.findOrCreate({
                where: { accountNumber: account.accountNumber },
                defaults: {
                    accountNumber: account.accountNumber,
                    accountName: account.accountName,
                    bankName: account.bankName,
                },
                transaction,
            });

            // Associate the post with the current user in UserPosts
            await db.UserPost.findOrCreate({
                where: { userId: userId, postId: post.id },
                defaults: { userId: userId, postId: post.id },
                transaction,
            });

            // Create a DepenPost record linked to the post and user
            await db.DepenPost.create(
                {
                    postId: post.id,
                    evidenceLink: account.evidenceLink,
                    advice: account.advice,
                    userId: userId,
                },
                { transaction }
            );
        }

        // Commit the transaction
        await transaction.commit();

        return {
            EM: "Tất cả các tài khoản được xử lý thành công.",
            EC: 0,
        };
    } catch (error) {
        // Rollback the transaction in case of error
        await transaction.rollback();
        console.error("Error processing accounts:", error);
        return {
            EM: "Đã xảy ra lỗi khi xử lý tài khoản.",
            EC: 1,
            DT: [],
        };
    }
};

// Function to handle deleting a user account by userId
// Hàm xử lý xóa tài khoản người dùng theo userId
const handleDeleteAccount = async (userId) => {
    try {
        // Attempt to delete the user with the specified ID
        // Cố gắng xóa người dùng với ID được chỉ định
        const result = await db.User.destroy({
            where: { id: userId },
        });

        if (result) {
            return {
                EM: "Xóa tài khoản thành công.",
                EC: 0,
            };
        } else {
            return {
                EM: "Không tìm thấy tài khoản để xóa.",
                EC: -1,
            };
        }
    } catch (error) {
        console.error("Error in handleDeleteAccount:", error);
        return {
            EM: "Lỗi khi xóa tài khoản.",
            EC: -1,
        };
    }
};

// Function to handle banning a user by setting their groupId to 3
// Hàm xử lý cấm người dùng bằng cách đặt groupId của họ thành 3
const handleBanAccount = async (userId) => {
    try {
        // Attempt to update the user's groupId to 3 (banned)
        // Cố gắng cập nhật groupId của người dùng thành 3 (bị cấm)
        const result = await db.User.update(
            { groupId: 3 },
            {
                where: { id: userId },
            }
        );

        if (result[0] > 0) {
            return {
                EM: "Người dùng đã được cấm thành công.",
                EC: 0,
            };
        } else {
            return {
                EM: "Không tìm thấy người dùng để cấm.",
                EC: -1,
            };
        }
    } catch (error) {
        console.error("Error in handleBanAccount:", error);
        return {
            EM: "Lỗi server khi cố gắng cấm người dùng.",
            EC: -1,
        };
    }
};

module.exports = {
    handleGetAllUsers,
    handlePostScammer,
    handleDeleteAccount,
    handleBanAccount,
};
