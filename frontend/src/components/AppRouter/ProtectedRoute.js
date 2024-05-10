import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";

// Component for protecting routes based on user roles
// Component bảo vệ routes dựa trên vai trò người dùng
const ProtectedRoute = ({ children, allowedRoles }) => {
    // Get the access token from Redux store
    // Lấy token truy cập từ Redux store
    const accessToken = useSelector(
        (state) => state.user?.userAccount?.accessToken
    );

    const navigate = useNavigate();

    // Effect to check user role and token validity
    // Effect để kiểm tra vai trò người dùng và tính hợp lệ của token
    useEffect(() => {
        if (!accessToken || typeof accessToken !== "string") {
            navigate("/dang-nhap");
            return;
        }

        try {
            // Decode the JWT to extract user roles
            // Giải mã JWT để trích xuất vai trò người dùng
            const decodedToken = jwtDecode(accessToken);
            const userRole = decodedToken.roles.roleName;

            // Check if userRole is "banner", redirect to ban page
            // Kiểm tra nếu userRole là "banner", chuyển hướng đến trang cấm
            if (userRole === "banner") {
                navigate("/cam-tai-khoan");
                return;
            }

            // If user does not have allowed access, redirect to home page
            // Nếu người dùng không có quyền truy cập cho phép, chuyển hướng về trang chủ
            if (!allowedRoles.includes(userRole)) {
                navigate("/");
                return;
            }
        } catch (error) {
            // Navigate to login on error
            // Điều hướng đến trang đăng nhập khi có lỗi
            navigate("/dang-nhap");
        }
    }, [accessToken, allowedRoles, navigate]);

    return children;
};

export default ProtectedRoute;
