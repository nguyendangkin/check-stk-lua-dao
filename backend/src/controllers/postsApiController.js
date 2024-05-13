import {
    handleGetAllPosts,
    handleGetPost,
    handleGetComment,
    handleGetInfoUser,
    handleDeletePost,
    handleDeleteComment,
} from "../services/postsApiService";

// Controller for getting all posts based on search keywords, pagination limits, and offsets
// Controller để lấy tất cả bài đăng dựa trên từ khoá tìm kiếm, limit phân trang và offset
const getAllPosts = async (req, res) => {
    try {
        // Lấy từ khóa tìm kiếm, giới hạn và offset từ query parameters
        // Get search keyword, limit, and offset from query parameters
        const searchKeyword = req.query.search?.trim() || "";
        const limit = parseInt(req.query.limit) || 5;
        const offset = parseInt(req.query.offset) || 0;

        // Call the service function to get all posts with the specified parameters
        // Gọi service để lấy tất cả bài đăng với các tham số đã chỉ định
        const posts = await handleGetAllPosts(searchKeyword, limit, offset);

        return res.json({
            EC: posts.EC,
            EM: posts.EM,
            DT: posts.DT,
            // Tổng số bài đăng
            // Total number of posts
            totalPosts: posts.totalPosts,
        });
    } catch (error) {
        console.error("Error in getAllPosts:", error);
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
        // Lấy số tài khoản từ body của request
        // Get account number from request body
        const accountNumber = req.body.accountNumber?.trim();

        // Gọi service để lấy bài đăng theo số tài khoản
        // Call the service function to get the post by account number
        const post = await handleGetPost(accountNumber);

        if (!post) {
            return res
                .status(404)
                .json({ EC: -1, EM: "Không tìm thấy bài viết." });
        }

        return res.json({ EC: post.EC, EM: post.EM, DT: post.DT });
    } catch (error) {
        console.error("Error in getPost:", error);
        return res
            .status(500)
            .json({ EC: 1, EM: "Lỗi khi lấy dữ liệu bài viết.", DT: [] });
    }
};

// Controller for getting comments of a post based on account number, with pagination
// Controller để lấy các bình luận của một bài đăng dựa trên số tài khoản, với phân trang
const getComment = async (req, res) => {
    try {
        // Lấy số tài khoản từ body của request
        // Get account number from request body
        const accountNumber = req.body.accountNumber?.trim();

        // Lấy trang và giới hạn từ body của request hoặc đặt mặc định
        // Get page and limit from request body or set default values
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 5;

        // Gọi service để lấy các bình luận theo số tài khoản, trang và giới hạn
        // Call the service function to get comments by account number, page, and limit
        const comments = await handleGetComment(accountNumber, page, limit);

        if (!comments) {
            return res
                .status(404)
                .json({ EC: -1, EM: "Không tìm thấy bình luận." });
        }

        return res.json({
            EC: comments.EC,
            EM: comments.EM,
            DT: comments.DT,
            // Tổng số bình luận
            // Total number of comments
            totalComments: comments.totalComments,
        });
    } catch (error) {
        console.error("Error in getComment:", error);
        return res
            .status(500)
            .json({ EC: 1, EM: "Lỗi khi lấy dữ liệu bình luận.", DT: [] });
    }
};

//
const getInfoUser = async (req, res) => {
    try {
        const idUser = req.body.idUser;
        const infoUser = await handleGetInfoUser(idUser);
        if (infoUser) {
            return res.json({
                EC: infoUser.EC,
                EM: infoUser.EM,
                DT: infoUser.DT,
            });
        }
    } catch (error) {
        console.error("Error in getInfoUser controller:", error);
        res.status(500).json({
            error: "An error occurred while fetching user information.",
        });
    }
};

const deletePost = async (req, res) => {
    try {
        const idPost = req.body.idPost;
        console.log("check idPost", idPost);
        const result = await handleDeletePost(idPost);
        if (result) {
            return res.json({
                EC: result.EC,
                EM: result.EM,
                DT: result.DT,
            });
        }
    } catch (error) {
        console.error("Error in deletePost controller:", error);
        res.status(500).json({
            error: "An error occurred while deleting the post.",
        });
    }
};

const deleteComment = async (req, res) => {
    try {
        const idComment = req.body.idComment;
        const result = await handleDeleteComment(idComment);
        if (result) {
            return res.json({
                EC: result.EC,
                EM: result.EM,
                DT: result.DT,
            });
        }
    } catch (error) {
        console.error("Error in deleteComment controller:", error);
        res.status(500).json({
            error: "An error occurred while deleting the comment.",
        });
    }
};

module.exports = {
    getAllPosts,
    getPost,
    getComment,
    getInfoUser,
    deletePost,
    deleteComment,
};
