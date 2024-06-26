import {
    handleGetAllPosts,
    handleGetPost,
    handleGetComment,
    handleGetInfoUser,
    handleDeletePost,
    handleDeleteComment,
    handleDeleteAllComment,
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
        const accountNumber = req.body?.accountNumber?.trim();
        const limit = parseInt(req.body.limit) || 5;
        const offset = parseInt(req.body.offset) || 0; // Use offset directly from request

        const comments = await handleGetComment(accountNumber, offset, limit);

        if (!comments) {
            return res
                .status(404)
                .json({ EC: -1, EM: "Không tìm thấy bình luận." });
        }

        return res.json({
            EC: comments.EC,
            EM: comments.EM,
            DT: comments.DT,
            totalComments: comments.totalComments,
        });
    } catch (error) {
        console.error("Error in getComment:", error);
        return res
            .status(500)
            .json({ EC: 1, EM: "Lỗi khi lấy dữ liệu bình luận.", DT: [] });
    }
};

// Controller to get user information with pagination
// Controller lấy thông tin người dùng với phân trang
const getInfoUser = async (req, res) => {
    try {
        const idUser = req.body.idUser;
        const page = parseInt(req.body.page) || 1;
        const pageSize = parseInt(req.body.pageSize) || 5;

        const infoUser = await handleGetInfoUser(idUser, page, pageSize);
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

// Controller to delete a post
// Controller để xóa bài đăng
const deletePost = async (req, res) => {
    try {
        const idPost = req.body.idPost;
        const idUser = req.body.idUser;
        const result = await handleDeletePost(idPost, idUser);
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

// Controller to delete a comment
// Controller để xóa bình luận
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

// Controller to delete all comments for a post
// Controller để xóa tất cả bình luận cho một bài đăng
const deleteAllComment = async (req, res) => {
    try {
        const { idPost, idUser } = req.body; // ĐPost được truyền từ body
        const result = await handleDeleteAllComment(idPost, idUser);
        if (result) {
            return res.json({
                EC: result.EC,
                EM: result.EM,
                DT: result.DT,
            });
        }
    } catch (error) {
        console.error("Error in deleteAllComment controller:", error);
        res.status(500).json({
            error: "An error occurred while deleting all the comments.",
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
    deleteAllComment,
};
