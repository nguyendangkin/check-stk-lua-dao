import axios from "axios";
import { store } from "./../redux/store";

// Create an Axios instance with base URL and credentials
// Tạo một instance của Axios với URL cơ bản và credentials
const instance = axios.create({
    baseURL: "http://localhost:3001/",
    withCredentials: true,
});

// Request interceptor to attach the access token
// Interceptor yêu cầu để gắn token truy cập
instance.interceptors.request.use(
    function (config) {
        // Get `accessToken` from Redux store
        // Lấy `accessToken` từ Redux store
        const state = store.getState();
        const accessToken = state?.user?.userAccount?.accessToken;

        if (accessToken) {
            // Attach `accessToken` to request headers
            // Gắn `accessToken` vào phần headers của request
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// Response interceptor to handle responses and errors
// Interceptor phản hồi để xử lý phản hồi và lỗi
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
