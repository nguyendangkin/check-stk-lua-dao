// src/redux/slices/postsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
    requestGetComment,
    requestGetFilteredPosts,
    requestGetPost,
} from "../requestApi/postsApiThunk";

const initialState = {
    searchResults: [],
    postInfo: null,
    depenPosts: [],
    totalPosts: 0,
    totalDepenPosts: 0,
    loading: false,
};

export const counterSlice = createSlice({
    name: "usersApi",
    initialState,
    reducers: {
        resetDepenPosts: (state) => {
            state.depenPosts = [];
            state.totalDepenPosts = 0;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(requestGetFilteredPosts.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(requestGetFilteredPosts.fulfilled, (state, action) => {
            state.loading = false;
            state.searchResults = action.payload?.DT;
            state.totalPosts = action.payload?.totalPosts;
        });
        builder.addCase(requestGetFilteredPosts.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(requestGetPost.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(requestGetPost.fulfilled, (state, action) => {
            state.loading = false;
            state.postInfo = action.payload?.DT;
        });
        builder.addCase(requestGetPost.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(requestGetComment.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(requestGetComment.fulfilled, (state, action) => {
            state.loading = false;
            state.totalDepenPosts = action.payload?.totalComments;
            state.depenPosts = [...state.depenPosts, ...action.payload?.DT];
        });
        builder.addCase(requestGetComment.rejected, (state) => {
            state.loading = false;
        });
    },
});

export const { resetDepenPosts } = counterSlice.actions;
export default counterSlice.reducer;
