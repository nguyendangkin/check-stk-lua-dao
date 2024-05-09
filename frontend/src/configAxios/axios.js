import axios from "axios";
import { store } from "./../redux/store";

const instance = axios.create({
    baseURL: "http://localhost:3001/",
    withCredentials: true,
});

instance.interceptors.request.use(
    function (config) {
        // Lấy `accessToken` từ Redux store
        const state = store.getState(); // Lấy toàn bộ state từ store
        const accessToken = state?.user?.userAccount?.accessToken; // Truy cập `accessToken` từ Redux

        if (accessToken) {
            // Gắn `accessToken` vào phần headers của request
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);
// Add a response interceptor
instance.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
    }
);

export default instance;
