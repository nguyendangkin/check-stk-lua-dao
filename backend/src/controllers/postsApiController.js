import {
    handleGetAllPosts,
    handleGetPost,
    handleGetComment,
} from "../services/postsApiService";

// Controller for getting all posts based on search keywords, pagination limits, and offsets
// Controller để lấy tất cả bài đăng dựa trên từ khoá tìm kiếm, limit phân trang và offset
const getAllPosts = async (req, res) => {
    try {
        const searchKeyword = req.query.search || "";
        const limit = parseInt(req.query.limit) || 5;
        const offset = parseInt(req.query.offset) || 0;

        // Call the service function to get all posts with the specified parameters
        // Gọi service để lấy tất cả bài đăng với các tham số đã chỉ định
        const posts = await handleGetAllPosts(
            searchKeyword,
            parseInt(limit),
            parseInt(offset)
        );

        return res.json({
            EC: posts.EC,
            EM: posts.EM,
            DT: posts.DT,
            totalPosts: posts.totalPosts,
        });
    } catch (error) {
        console.log("Error fetching posts:", error);
        return res.status(500).json({
            EC: 1,
            EM: "Lỗi khi lấy dữ liệu.",
            DT: [],
        });
    }
};

// Controller for getting a single post based on account number
// Controller để lấy một bài đăng dựa trên số tài khoản
const getPost = async (req, res) => {
    try {
        const accountNumber = req.body.accountNumber;
        const post = await handleGetPost(accountNumber);
        if (!post) {
            return res.json({ EC: post.EC, EM: post.EM });
        }
        return res.json({ EC: post.EC, EM: post.EM, DT: post.DT });
    } catch (error) {
        console.error("Error in getPost:", error);
        return res
            .status(500)
            .json({ EC: 1, EM: "Error fetching post.", DT: [] });
    }
};

// Controller for getting comments of a post based on account number, with pagination
// Controller để lấy các bình luận của một bài đăng dựa trên số tài khoản, với phân trang
const getComment = async (req, res) => {
    try {
        const accountNumber = req.body.accountNumber;
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 5;

        const comments = await handleGetComment(accountNumber, page, limit);
        if (!comments) {
            return res.json({ EC: comments.EC, EM: comments.EM });
        }
        return res.json({
            EC: comments.EC,
            EM: comments.EM,
            DT: comments.DT,
            totalComments: comments.totalComments,
        });
    } catch (error) {
        console.error("Error in getPost:", error);
        return res
            .status(500)
            .json({ EC: 1, EM: "Error fetching post.", DT: [] });
    }
};

module.exports = {
    getAllPosts,
    getPost,
    getComment,
};
