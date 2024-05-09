import { createSlice } from "@reduxjs/toolkit";
import {
    requestGetComment,
    requestGetFilteredPosts,
    requestGetPost,
} from "../requestApi/postsApiThunk";

const initialState = {
    searchResults: [],
    postInfo: null,
    depenPosts: null,
    totalPosts: 0,
    totalDepenPosts: 0,
};

export const counterSlice = createSlice({
    name: "usersApi",
    initialState,
    reducers: {
        setFilteredPosts(state) {
            state.searchResults = [];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(requestGetFilteredPosts.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(requestGetFilteredPosts.fulfilled, (state, action) => {
            state.loading = false;
            state.searchResults = action.payload?.DT;
            state.totalPosts = action.payload?.totalPosts;
        });
        builder.addCase(requestGetFilteredPosts.rejected, (state, action) => {
            state.loading = false;
        });
        //
        builder.addCase(requestGetPost.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(requestGetPost.fulfilled, (state, action) => {
            state.loading = false;
            state.postInfo = action.payload?.DT;
        });
        builder.addCase(requestGetPost.rejected, (state, action) => {
            state.loading = false;
        });
        //
        builder.addCase(requestGetComment.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(requestGetComment.fulfilled, (state, action) => {
            state.loading = false;
            state.totalDepenPosts = action.payload?.totalComments;
            if (state.depenPosts) {
                state.depenPosts = [...state.depenPosts, ...action.payload?.DT];
            } else {
                state.depenPosts = action.payload?.DT;
            }
        });
        builder.addCase(requestGetComment.rejected, (state, action) => {
            state.loading = false;
        });
    },
});

export const { setFilteredPosts } = counterSlice.actions;
export default counterSlice.reducer;
