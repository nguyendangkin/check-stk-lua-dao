const { Sequelize, Op } = require("sequelize");
import db from "../../models/index";

// Function to handle retrieving all posts with optional search, pagination, and ordering
// Hàm xử lý lấy tất cả các bài viết với tùy chọn tìm kiếm, phân trang và sắp xếp
const handleGetAllPosts = async (searchKeyword, limit, offset) => {
    try {
        const conditions = {};
        if (searchKeyword) {
            conditions[Op.or] = [
                {
                    accountNumber: { [Op.like]: `%${searchKeyword}%` },
                },
                {
                    accountName: { [Op.like]: `%${searchKeyword}%` },
                },
            ];
        }

        const posts = await db.Post.findAll({
            where: conditions,
            limit,
            offset,
            order: [["createdAt", "DESC"]],
        });

        const totalPosts = await db.Post.count({
            where: conditions,
        });

        return {
            EM: "Lấy tất cả bài viết thành công.",
            EC: 0,
            DT: posts,
            totalPosts: totalPosts,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: "Lỗi khi lấy dữ liệu bài viết.",
            EC: 1,
            DT: [],
        };
    }
};

// Function to handle retrieving a specific post by account number
// Hàm xử lý lấy một bài viết cụ thể bằng số tài khoản
const handleGetPost = async (accountNumber) => {
    try {
        const post = await db.Post.findOne({
            where: { accountNumber: accountNumber },
            include: [
                {
                    model: db.User,
                    attributes: ["fullName"],
                },
            ],
            attributes: ["accountNumber", "accountName", "bankName"],
        });

        if (!post) {
            return {
                EM: "Không tìm thấy bài viết.",
                EC: -1,
                DT: null,
            };
        }

        const result = {
            accountNumber: post.accountNumber,
            accountName: post.accountName,
            bankName: post.bankName,
        };

        return {
            EM: "Lấy bài viết thành công.",
            EC: 0,
            DT: result,
        };
    } catch (error) {
        console.error("Error in handleGetPost:", error);
        throw error;
    }
};

// Function to handle retrieving comments for a specific post with pagination
// Hàm xử lý lấy bình luận cho một bài viết cụ thể với phân trang kiểu cuộn loading
const handleGetComment = async (accountNumber, page = 1, limit = 5) => {
    try {
        const offset = (page - 1) * limit;

        const post = await db.Post.findOne({
            where: { accountNumber: accountNumber },
            include: [
                {
                    model: db.DepenPost,
                    attributes: ["evidenceLink", "advice"],
                    include: [
                        {
                            model: db.User,
                            attributes: ["fullName"],
                        },
                    ],
                    limit: limit,
                    offset: offset,
                },
            ],
        });

        if (!post) {
            return {
                EM: "Không tìm thấy bài viết.",
                EC: -1,
                DT: null,
            };
        }

        const totalDepenPosts = await db.DepenPost.count({
            where: { postId: post.id },
        });

        const formattedDepenPosts = post.DepenPosts
            ? post.DepenPosts.map((depenPost) => ({
                  evidenceLink: depenPost.evidenceLink,
                  advice: depenPost.advice,
                  userName: depenPost.User
                      ? depenPost.User.fullName
                      : "Không xác định",
              }))
            : [];

        return {
            EM: "Lấy bài viết thành công.",
            EC: 0,
            DT: formattedDepenPosts,
            totalComments: totalDepenPosts,
        };
    } catch (error) {
        console.error("Error in handleGetPost:", error);
        throw error;
    }
};

module.exports = {
    handleGetAllPosts,
    handleGetPost,
    handleGetComment,
};
