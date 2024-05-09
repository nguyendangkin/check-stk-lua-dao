import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const accessToken = useSelector(
        (state) => state.user?.userAccount?.accessToken
    );

    const navigate = useNavigate();

    useEffect(() => {
        if (!accessToken || typeof accessToken !== "string") {
            navigate("/dang-nhap");
            return;
        }

        try {
            const decodedToken = jwtDecode(accessToken);
            const userRole = decodedToken.roles.roleName;

            // Kiểm tra nếu userRole là "banner", chuyển hướng đến trang cấm
            if (userRole === "banner") {
                navigate("/cam-tai-khoan");
                return;
            }

            // Nếu người dùng không có quyền truy cập cho phép, chuyển hướng về trang chủ
            if (!allowedRoles.includes(userRole)) {
                navigate("/");
                return;
            }
        } catch (error) {
            navigate("/dang-nhap");
        }
    }, [accessToken, allowedRoles, navigate]);

    return children;
};

export default ProtectedRoute;
