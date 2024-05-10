import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../configAxios/axios";

// Async thunk to get filtered posts
// Thunk bất đồng bộ để lấy bài viết đã lọc
export const requestGetFilteredPosts = createAsyncThunk(
    "usersApiSlice/requestGetFilteredPosts",
    async ({ searchKeyword, limit, offset }) => {
        const response = await axios.get(
            `/api/v1/get-all-posts?search=${searchKeyword}&limit=${limit}&offset=${offset}`
        );
        return response.data;
    }
);

// Async thunk to get a single post by account number
// Thunk bất đồng bộ để lấy một bài viết theo số tài khoản
export const requestGetPost = createAsyncThunk(
    "usersApiSlice/requestGetPost",
    async (accountNumber) => {
        const response = await axios.post(`/api/v1/get-post`, accountNumber);
        return response.data;
    }
);

// Async thunk to get comments for a post
// Thunk bất đồng bộ để lấy bình luận cho một bài viết
export const requestGetComment = createAsyncThunk(
    "usersApiSlice/requestGetComment",
    async ({ accountNumber, page = 1 }) => {
        const response = await axios.post(`/api/v1/get-comment`, {
            accountNumber,
            page,
        });
        return response.data;
    }
);
