import axios from "axios";
import { store } from "./../redux/store";
import { useNavigate } from "react-router-dom";
import { logOut } from "../redux/reducer/userAccountSlice";

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
        return response;
    },
    function (error) {
        // Check for error response and handle 401 Unauthorized specifically
        if (error.response) {
            if (
                error.response.status === 401 &&
                error.response.data.EC === -2
            ) {
                // Assuming logOut is a Redux action to clear the user state
                store.dispatch(logOut());
                // Redirect to login page
                window.location.href = "/dang-nhap";
                // If using React Router v6, you might use navigate('/login') instead
            } else if (
                error.response.status === 403 &&
                error.response.data.EC === -3
            ) {
                // Handle case when the user is banned
                store.dispatch(logOut());
                // Redirect to login page, showing that they've been banned
                window.location.href = "/cam-tai-khoan";
                // Optionally, you could pass a query parameter or similar to show a specific message on the login page
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
