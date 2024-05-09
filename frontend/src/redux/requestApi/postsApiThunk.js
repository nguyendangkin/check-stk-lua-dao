import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../configAxios/axios";

export const requestGetFilteredPosts = createAsyncThunk(
    "usersApiSlice/requestGetFilteredPosts",
    async ({ searchKeyword, limit, offset }) => {
        const response = await axios.get(
            `/api/v1/get-all-posts?search=${searchKeyword}&limit=${limit}&offset=${offset}`
        );
        return response.data;
    }
);

export const requestGetPost = createAsyncThunk(
    "usersApiSlice/requestGetPost",
    async (accountNumber) => {
        const response = await axios.post(`/api/v1/get-post`, accountNumber);
        return response.data;
    }
);

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
