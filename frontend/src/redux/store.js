import { configureStore } from "@reduxjs/toolkit";
import userAccountReducer from "./reducer/userAccountSlice";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import usersApiSlice from "./reducer/usersApiSlice";
import postsApiSlice from "./reducer/postsApiSlice";

const userPersistConfig = {
    key: "user",
    storage,
    whitelist: ["userAccount"],
};

const userPersistedReducer = persistReducer(
    userPersistConfig,
    userAccountReducer
);

export const store = configureStore({
    reducer: {
        user: userPersistedReducer,
        users: usersApiSlice,
        posts: postsApiSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
            },
        }),
});

export const persistor = persistStore(store);
