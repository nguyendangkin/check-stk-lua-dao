const { Sequelize, Op } = require("sequelize");
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
        throw error;
    }
};

// Function to handle retrieving comments for a specific post with pagination
// Hàm xử lý lấy bình luận cho một bài viết cụ thể với phân trang kiểu cuộn loading
const handleGetComment = async (accountNumber, page = 1, limit = 5) => {
    try {
        // Calculates the offset for pagination based on the provided page number and limit.
        // Tính toán offset cho phân trang dựa trên số trang và limit được cung cấp.
        const offset = (page - 1) * limit;

        // Fetches the post from the database based on the account number.
        // Lấy bài viết từ cơ sở dữ liệu dựa trên số tài khoản.
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

        // Returns an error response if no post is found for the given account number.
        // Trả về response lỗi nếu không tìm thấy bài viết nào cho số tài khoản đã cho.
        if (!post) {
            return {
                EM: "Không tìm thấy bài viết.",
                EC: -1,
                DT: null,
            };
        }

        // Counts the total number of comments for the post.
        // Đếm tổng số bình luận cho bài viết.
        const totalDepenPosts = await db.DepenPost.count({
            where: { postId: post.id },
        });

        // Formats the retrieved comments by extracting relevant properties and handling potential missing user data.
        // Định dạng các bình luận được truy xuất bằng cách trích xuất các thuộc tính có liên quan và xử lý dữ liệu người dùng bị thiếu (nếu có).
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
        console.error("Error in handleGetPost:", error);
        throw error;
    }
};

module.exports = {
    handleGetAllPosts,
    handleGetPost,
    handleGetComment,
};
