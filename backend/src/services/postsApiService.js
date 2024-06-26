const { Sequelize, Op, where } = require("sequelize");
import db from "../../models/index";

// Function to handle retrieving all posts with optional search, pagination, and ordering
// Hàm xử lý lấy tất cả các bài viết với tùy chọn tìm kiếm, phân trang và sắp xếp
const handleGetAllPosts = async (searchKeyword, limit, offset) => {
    try {
        // Initializes an empty conditions object for the database query.
        // Khởi tạo một đối tượng điều kiện trống cho truy vấn cơ sở dữ liệu.
        const conditions = {};

        // If a search keyword is provided, adds LIKE conditions for account number and account name.
        // Nếu có cung cấp từ khóa tìm kiếm, hãy thêm điều kiện LIKE cho số tài khoản và tên tài khoản.
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

        // Fetches posts from the database with the specified conditions, pagination (limit, offset), and default descending order by creation date.
        // Lấy các bài viết từ cơ sở dữ liệu với các điều kiện được chỉ định, phân trang (limit, offset) và theo thứ tự mặc định giảm dần theo ngày tạo.
        const posts = await db.Post.findAll({
            where: conditions,
            limit,
            offset,
            order: [["createdAt", "DESC"]],
        });

        // Counts the total number of posts matching the conditions (for pagination information).
        // Đếm tổng số bài viết khớp với các điều kiện (để biết thông tin phân trang).
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
        console.error("Error in handleGetAllPosts:", error);
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
        // Fetches a single post from the database based on the provided account number.
        // Lấy một bài đăng duy nhất từ cơ sở dữ liệu dựa trên số tài khoản được cung cấp.
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

        // Returns an error response if no post is found for the given account number.
        // Trả về response lỗi nếu không tìm thấy bài viết nào cho số tài khoản đã cho.
        if (!post) {
            return {
                EM: "Không tìm thấy bài viết.",
                EC: -1,
                DT: null,
            };
        }

        // Creates a new result object containing only the desired post properties.
        // Tạo một đối tượng result mới chỉ chứa các thuộc tính bài viết mong muốn.
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
        return {
            EM: "Lỗi khi lấy bài viết.",
            EC: 1,
            DT: null,
        };
    }
};

// Function to handle retrieving comments for a specific post with pagination
// Hàm xử lý lấy bình luận cho một bài viết cụ thể với phân trang kiểu cuộn loading
const handleGetComment = async (accountNumber, offset = 0, limit = 5) => {
    try {
        const post = await db.Post.findOne({
            where: { accountNumber: accountNumber },
            include: [
                {
                    model: db.DepenPost,
                    attributes: ["evidenceLink", "advice"],
                    include: [
                        {
                            model: db.User,
                            attributes: ["fullName", "email"],
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
                  email: depenPost.User?.email,
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
        console.error("Error in handleGetComment:", error);
        return {
            EM: "Lỗi khi lấy bình luận.",
            EC: 1,
            DT: null,
        };
    }
};

// Function to get user information with pagination
// Hàm để lấy thông tin người dùng với phân trang
const handleGetInfoUser = async (id, page = 1, pageSize = 5) => {
    console.log("Fetching user info", id, page, pageSize);
    const offset = (page - 1) * pageSize;

    try {
        const user = await db.User.findByPk(id, {
            attributes: ["id", "email", "fullName"],
        });

        if (!user) {
            return {
                EM: "User not found.",
                EC: 1,
                DT: null,
            };
        }

        // Fetching posts through the UserPost association with correct aliases
        const { count, rows } = await db.UserPost.findAndCountAll({
            where: { userId: id },
            limit: pageSize,
            offset: offset,
            include: [
                {
                    model: db.Post,
                    as: "Post", // Correct alias as defined in UserPost model
                    include: [
                        {
                            model: db.DepenPost,
                            as: "DepenPosts", // Correct alias as defined in Post model
                            attributes: [
                                "id",
                                "evidenceLink",
                                "advice",
                                "postId",
                            ],
                            where: { userId: id },
                            required: false,
                        },
                    ],
                },
            ],
        });

        return {
            EM: "Successfully retrieved user info.",
            EC: 0,
            DT: {
                user: user,
                posts: rows.map((userPost) => userPost.Post),
                totalPosts: count,
            },
        };
    } catch (error) {
        console.error("Error fetching user info:", error);
        return {
            EM: "Error fetching user info.",
            EC: 1,
            DT: null,
        };
    }
};

// Function to delete a post
// Hàm để xóa bài đăng
const handleDeletePost = async (postId, userId) => {
    const transaction = await db.sequelize.transaction();
    try {
        console.log(
            "Starting deletion of user post relations",
            postId,
            "for user",
            userId
        );
        // Xóa các bình luận liên quan đến bài viết và người dùng này
        await db.DepenPost.destroy({
            where: { postId: postId, userId: userId },
            transaction,
        });

        // Xóa mối liên hệ trong UserPost giữa người dùng và bài viết
        await db.UserPost.destroy({
            where: { postId: postId, userId: userId },
            transaction,
        });

        // Commit transaction nếu không có lỗi
        await transaction.commit();

        return {
            EM: "Xóa mối liên hệ và bình luận liên quan thành công.",
            EC: 0,
            DT: null,
        };
    } catch (error) {
        // Rollback transaction nếu có lỗi
        await transaction.rollback();
        console.error("Error in handleDeletePost:", error);
        return {
            EM: "Lỗi khi xóa mối liên hệ bài viết.",
            EC: 1,
            DT: null,
        };
    }
};

// Function to delete a comment
// Hàm để xóa bình luận
const handleDeleteComment = async (idComment) => {
    try {
        await db.DepenPost.destroy({
            where: { id: idComment },
        });
        return {
            EM: "Xóa bình luận thành công.",
            EC: 0,
            DT: null,
        };
    } catch (error) {
        console.error("Error in handleDeleteComment:", error);
        return {
            EM: "Lỗi khi xóa bình luận.",
            EC: 1,
            DT: null,
        };
    }
};

// Function to delete all comments for a specific post and user
// Hàm để xóa tất cả bình luận cho một bài đăng cụ thể và người dùng
const handleDeleteAllComment = async (idPost, idUser) => {
    try {
        await db.DepenPost.destroy({
            where: {
                postId: idPost, // Chỉ xóa bình luận thuộc postId cụ thể
                userId: idUser, // Chỉ xóa
            },
        });
        return {
            EM: "Xóa tất cả bình luận thành công.",
            EC: 0,
            DT: null,
        };
    } catch (error) {
        console.error("Error in handleDeleteAllComment:", error);
        return {
            EM: "Lỗi khi xóa tất cả bình luận.",
            EC: 1,
            DT: null,
        };
    }
};

module.exports = {
    handleGetAllPosts,
    handleGetPost,
    handleGetComment,
    handleGetInfoUser,
    handleDeletePost,
    handleDeleteComment,
    handleDeleteAllComment,
};
