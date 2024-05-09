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
        const users = await db.User.findAll({
            where: searchKeyword && {
                email: { [Sequelize.Op.like]: `%${searchKeyword}%` },
            },
            attributes: ["id", "email", "fullName", "groupId"],

            limit: limit,
            offset: offset,
        });
        const totalUsers = await db.User.count({
            where: searchKeyword && {
                email: { [Sequelize.Op.like]: `%${searchKeyword}%` },
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
        console.log(error);
    }
};

// Function to handle posting a list of scammer accounts with transaction handling
// Hàm xử lý đăng danh sách tài khoản lừa đảo với xử lý giao dịch
const handlePostScammer = async (listAccount) => {
    const transaction = await db.sequelize.transaction();

    try {
        listAccount.accounts = listAccount.accounts.map((account) => ({
            ...account,
            accountNumber: normalizeVietnamese(account.accountNumber),
            accountName: normalizeVietnamese(account.accountName),
            bankName: normalizeVietnamese(account.bankName),
        }));

        const { accounts, userId } = listAccount;

        for (const account of accounts) {
            const [existingPost, created] = await db.Post.findOrCreate({
                where: { accountNumber: account.accountNumber },
                defaults: {
                    accountNumber: account.accountNumber,
                    accountName: account.accountName,
                    bankName: account.bankName,
                    userId: userId,
                },
                transaction,
            });

            await db.DepenPost.create(
                {
                    postId: existingPost.id,
                    evidenceLink: account.evidenceLink,
                    advice: account.advice,
                    userId: userId,
                },
                { transaction }
            );
        }

        await transaction.commit();

        return {
            EM: "Tất cả các tài khoản được xử lý thành công.",
            EC: 0,
        };
    } catch (error) {
        await transaction.rollback();
        console.error("Error processing accounts:", error);
        return {
            EM: "Đã xảy ra lỗi khi xử lý tài khoản. Ký tự vượt quá 255 ...",
            EC: 1,
            error: error.toString(),
        };
    }
};

// Function to handle deleting a user account by userId
// Hàm xử lý xóa tài khoản người dùng theo userId
const handleDeleteAccount = async (userId) => {
    try {
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
        console.log("Lỗi khi xóa tài khoản:", error);
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
        console.log("Lỗi khi cố gắng cấm người dùng:", error);
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
