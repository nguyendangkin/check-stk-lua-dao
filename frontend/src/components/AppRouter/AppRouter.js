import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "../layouts/Layout";
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import PostScam from "../pages/PostScam/PostScam";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import TopLoadingBar from "react-top-loading-bar";
import PageNotFound from "../pages/PageNotFound/PageNotFound";
import ProtectedRoute from "./ProtectedRoute";
import PasswordRetrieval from "../pages/PasswordRetrieval/PasswordRetrieval";
import Admin from "../pages/Admin/Admin";
import Ban from "../pages/Ban/Ban";
import InfoUser from "../pages/InfoUser/InfoUser";

// Main router component to handle application routing
// Component router chính để xử lý routing ứng dụng
const AppRouter = () => {
    // Get current location
    // Lấy vị trí hiện tại
    const location = useLocation();

    // State for loading bar progress
    // State cho tiến trình của thanh tải
    const [progress, setProgress] = useState(0);

    // Use effect to set progress bar when the location changes
    // Sử dụng useEffect để thiết lập thanh tiến trình khi location thay đổi
    useEffect(() => {
        setProgress(100);

        setTimeout(() => {
            setProgress(0);
        }, 300);
    }, [location.pathname]);

    return (
        <>
            <TopLoadingBar
                color="#65c9ff"
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            <Routes>
                <Route
                    path="/"
                    element={
                        <Layout>
                            <Home />
                        </Layout>
                    }
                />
                <Route
                    path="/to-cao-lua-dao"
                    element={
                        <ProtectedRoute allowedRoles={["admin", "user"]}>
                            <Layout>
                                <PostScam />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/thong-tin-chinh"
                    element={
                        <Layout>
                            <About />
                        </Layout>
                    }
                />
                <Route
                    path="/dang-ky"
                    element={
                        <Layout>
                            <Register />
                        </Layout>
                    }
                />

                <Route
                    path="/dang-nhap"
                    element={
                        <Layout>
                            <Login />
                        </Layout>
                    }
                />

                <Route
                    path="/quen-mat-khau"
                    element={
                        <Layout>
                            <PasswordRetrieval />
                        </Layout>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <Layout>
                                <Admin />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/cam-tai-khoan"
                    element={
                        <Layout>
                            <Ban />
                        </Layout>
                    }
                />

                <Route
                    path="/thong-tin-nguoi-dung"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <Layout>
                                <InfoUser />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={
                        <Layout>
                            <PageNotFound />
                        </Layout>
                    }
                />
            </Routes>
        </>
    );
};

export default AppRouter;
