import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../configAxios/axios";

export const requestGetAllUsers = createAsyncThunk(
    "usersApiSlice/requestGetAllUsers",
    async () => {
        try {
            const response = await axios.get("api/v1/get-all-users");
            return response.data;
        } catch (error) {}
    }
);

export const requestPostScam = createAsyncThunk(
    "usersApiSlice/requestPostScam",
    async (userData) => {
        try {
            const response = await axios.post("api/v1/post-scam", userData);
            return response.data;
        } catch (error) {}
    }
);

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

export const requestDeleteUser = createAsyncThunk(
    "usersApiSlice/requestDeleteUser",
    async (account) => {
        try {
            const response = await axios.post("api/v1/delete-account", account);
            return response.data;
        } catch (error) {}
    }
);

export const requestBanAccount = createAsyncThunk(
    "usersApiSlice/requestBanAccount",
    async (account) => {
        try {
            const response = await axios.post("api/v1/ban-account", account);
            return response.data;
        } catch (error) {}
    }
);
