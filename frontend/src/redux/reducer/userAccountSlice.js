import { createSlice } from "@reduxjs/toolkit";
import { requestLogin, requestRegister } from "../requestApi/userAccountThunk";

const initialState = {
    userAccount: null,
    loading: null,
    error: null,
    isAuthenticating: false,
};

export const counterSlice = createSlice({
    name: "userAccount",
    initialState,
    reducers: {
        logOut: (state) => {
            state.userAccount = null;
        },
        authenticating: (state) => {
            state.isAuthenticating = true;
        },
    },
    extraReducers: (builder) => {
        // register
        builder.addCase(requestRegister.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(requestRegister.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(requestRegister.rejected, (state, action) => {
            state.error = true;
        });

        // login
        builder.addCase(requestLogin.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(requestLogin.fulfilled, (state, action) => {
            state.loading = false;
            state.userAccount = action.payload.DT;
        });
        builder.addCase(requestLogin.rejected, (state, action) => {
            state.error = true;
        });
    },
});

export const { logOut, authenticating } = counterSlice.actions;
export default counterSlice.reducer;
