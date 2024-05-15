// src/redux/slices/postsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
    requestGetComment,
    requestGetFilteredPosts,
    requestGetInfoUser,
    requestGetPost,
} from "../requestApi/postsApiThunk";

const initialState = {
    searchResults: [],
    postInfo: null,
    depenPosts: [],
    totalPosts: 0,
    totalDepenPosts: 0,
    listInfoUser: null,
    idInfoUser: null,
    loading: false,
};

export const counterSlice = createSlice({
    name: "usersApi",
    initialState,
    reducers: {
        // reset comment when click new check
        resetDepenPosts: (state) => {
            state.depenPosts = [];
            state.totalDepenPosts = 0;
        },

        setIdInfoUser: (state, action) => {
            state.idInfoUser = action.payload;
        },
    },
    extraReducers: (builder) => {
        // get all posts
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

        // get the post
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

        // get comment for post
        builder.addCase(requestGetComment.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(requestGetComment.fulfilled, (state, action) => {
            state.loading = false;
            state.totalDepenPosts = action.payload?.totalComments;
            state.depenPosts = action.payload?.DT;
        });
        builder.addCase(requestGetComment.rejected, (state) => {
            state.loading = false;
        });

        // get info user and all comment
        builder.addCase(requestGetInfoUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(requestGetInfoUser.fulfilled, (state, action) => {
            state.loading = false;
            state.listInfoUser = action.payload?.DT;
        });
        builder.addCase(requestGetInfoUser.rejected, (state) => {
            state.loading = false;
        });
    },
});

export const { resetDepenPosts, setIdInfoUser } = counterSlice.actions;
export default counterSlice.reducer;
