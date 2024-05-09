import React from "react";
import classNames from "classnames/bind";
import MainHeader from "./MainHeader/MainHeader";
import styles from "./LayoutStyles.module.scss";
import Footer from "./Footer/Footer";

const cx = classNames.bind(styles);

const Layout = ({ children }) => (
    <div className="app">
        <div className={cx("header")}>
            <div className={cx("container")}>
                <MainHeader />
            </div>
        </div>
        <div className="container mt-2 mb-2">{children}</div>
        <Footer />
    </div>
);

export default Layout;
