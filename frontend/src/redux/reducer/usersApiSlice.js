import { createSlice } from "@reduxjs/toolkit";
import {
    requestGetAllUsers,
    requestGetFilteredPosts,
    requestGetFilteredUsers,
    requestPostScam,
} from "../requestApi/usersApiThunk";

const initialState = {
    listPost: [],
    searchResults: [],
    totalUsers: 0,
    loading: false,
};

export const counterSlice = createSlice({
    name: "usersApi",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Handle post scam request
        // Xử lý yêu cầu đăng bài lừa đảo
        builder.addCase(requestPostScam.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(requestPostScam.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(requestPostScam.rejected, (state, action) => {
            state.loading = false;
        });

        // Handle fetching filtered users
        // Xử lý lấy người dùng đã lọc
        builder.addCase(requestGetFilteredUsers.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(requestGetFilteredUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.searchResults = action.payload?.DT;
            state.totalUsers = action.payload?.totalUsers;
        });
        builder.addCase(requestGetFilteredUsers.rejected, (state, action) => {
            state.loading = false;
        });
    },
});

export const {} = counterSlice.actions;
export default counterSlice.reducer;
