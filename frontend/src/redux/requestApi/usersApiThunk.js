import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../configAxios/axios";

// Async thunk to get all users
// Thunk bất đồng bộ để lấy tất cả người dùng
export const requestGetAllUsers = createAsyncThunk(
    "usersApiSlice/requestGetAllUsers",
    async () => {
        try {
            const response = await axios.get("api/v1/get-all-users");
            return response.data;
        } catch (error) {}
    }
);

// Async thunk to post a scam report
// Thunk bất đồng bộ để đăng báo cáo lừa đảo
export const requestPostScam = createAsyncThunk(
    "usersApiSlice/requestPostScam",
    async (userData) => {
        try {
            const response = await axios.post("api/v1/post-scam", userData);
            return response.data;
        } catch (error) {}
    }
);

// Async thunk to get filtered users
// Thunk bất đồng bộ để lấy người dùng đã lọc
export const requestGetFilteredUsers = createAsyncThunk(
    "usersApiSlice/requestGetFilteredUsers",
    async ({ searchKeyword, limit, offset }) => {
        try {
            const response = await axios.get(
                `/api/v1/get-all-users?search=${searchKeyword}&limit=${limit}&offset=${offset}`
            );
            return response.data;
        } catch (error) {
            console.error("Lỗi khi tìm kiếm người dùng:", error);
            throw error;
        }
    }
);

// Async thunk to delete a user account
// Thunk bất đồng bộ để xóa tài khoản người dùng
export const requestDeleteUser = createAsyncThunk(
    "usersApiSlice/requestDeleteUser",
    async (account) => {
        try {
            const response = await axios.post("api/v1/delete-account", account);
            return response.data;
        } catch (error) {}
    }
);

// Async thunk to ban a user account
// Thunk bất đồng bộ để cấm tài khoản người dùng
export const requestBanAccount = createAsyncThunk(
    "usersApiSlice/requestBanAccount",
    async (account) => {
        try {
            const response = await axios.post("api/v1/ban-account", account);
            return response.data;
        } catch (error) {}
    }
);
