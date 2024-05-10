import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "./../../configAxios/axios";

// Async thunk for user registration
// Thunk bất đồng bộ để đăng ký người dùng
export const requestRegister = createAsyncThunk(
    "userAccountSlice/requestRegister",
    async (userData) => {
        const response = await axios.post("api/v1/register", userData);
        return response.data;
    }
);

// Async thunk for user login
// Thunk bất đồng bộ để đăng nhập người dùng
export const requestLogin = createAsyncThunk(
    "userAccountSlice/requestLogin",
    async (userData) => {
        const response = await axios.post("api/v1/login", userData);
        return response.data;
    }
);

// Async thunk for user logout
// Thunk bất đồng bộ để đăng xuất người dùng
export const requestLogout = createAsyncThunk(
    "userAccountSlice/requestLogout",
    async () => {
        const response = await axios.post("api/v1/logout");
        return response.data;
    }
);

// Async thunk for password retrieval
// Thunk bất đồng bộ để lấy lại mật khẩu
export const requestPassRetri = createAsyncThunk(
    "userAccountSlice/requestPassRetri",
    async (userData) => {
        const response = await axios.post("api/v1/pass-retri", userData);
        return response.data;
    }
);

// Async thunk for verifying registration code
// Thunk bất đồng bộ để xác thực mã đăng ký
export const requestVerifyCodeRegister = createAsyncThunk(
    "userAccountSlice/requestVerifyCodeRegister",
    async (userData) => {
        const response = await axios.post(
            "api/v1/verify-code-register",
            userData
        );
        return response.data;
    }
);

// Async thunk for sending verification code email
// Thunk bất đồng bộ để gửi email mã xác thực
export const requestCodeEmail = createAsyncThunk(
    "userAccountSlice/requestCodeEmail",
    async (userData) => {
        const response = await axios.post("api/v1/send-code-email", userData);
        return response.data;
    }
);
