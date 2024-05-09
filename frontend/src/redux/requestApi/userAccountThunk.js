import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "./../../configAxios/axios";

export const requestRegister = createAsyncThunk(
    "userAccountSlice/requestRegister",
    async (userData) => {
        const response = await axios.post("api/v1/register", userData);
        return response.data;
    }
);

export const requestLogin = createAsyncThunk(
    "userAccountSlice/requestLogin",
    async (userData) => {
        const response = await axios.post("api/v1/login", userData);
        return response.data;
    }
);

export const requestLogout = createAsyncThunk(
    "userAccountSlice/requestLogout",
    async () => {
        const response = await axios.post("api/v1/logout");
        return response.data;
    }
);

export const requestPassRetri = createAsyncThunk(
    "userAccountSlice/requestPassRetri",
    async (userData) => {
        const response = await axios.post("api/v1/pass-retri", userData);
        return response.data;
    }
);

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

export const requestCodeEmail = createAsyncThunk(
    "userAccountSlice/requestCodeEmail",
    async (userData) => {
        const response = await axios.post("api/v1/send-code-email", userData);
        return response.data;
    }
);
