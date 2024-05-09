import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import styles from "./MainHeader.module.scss";
import { useState } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { requestLogout } from "../../../redux/requestApi/userAccountThunk";
import { logOut } from "../../../redux/reducer/userAccountSlice";

const cx = classNames.bind(styles);

function MainHeader() {
    const userAccount = useSelector((state) => state.user?.userAccount);
    const distPatch = useDispatch();

    const [isActive, setIsActive] = useState(false);

    const handleOnClick = (e) => {
        setIsActive(!isActive);
    };

    const handleLogout = () => {
        distPatch(requestLogout());
        distPatch(logOut());
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand as={Link} to={"/"}>
                    Check STK Lừa Đảo
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className={cx("align-items-center")}>
                        <Nav.Item>
                            <Nav.Link as={Link} to={"/to-cao-lua-dao"}>
                                Tố cáo lừa đảo
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to={"/thong-tin-chinh"}>
                                Thông tin chính
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to={"/admin"}>
                                FORADMIN
                            </Nav.Link>
                        </Nav.Item>
                        <NavDropdown
                            title={
                                <button
                                    onClick={handleOnClick}
                                    className={cx("avatar-button")}
                                >
                                    <img
                                        src="https://user-images.githubusercontent.com/522079/90506845-e8420580-e122-11ea-82ca-31087fc8486c.png"
                                        className={cx(
                                            "rounded-circle",
                                            "avatar-image"
                                        )}
                                        alt="Avatar"
                                    />
                                </button>
                            }
                            id="nav-dropdown"
                            className="nav-dropdown"
                        >
                            {userAccount?.accessToken && (
                                <>
                                    <NavDropdown.Item>
                                        Thông tin cá nhân
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        onClick={() => handleLogout()}
                                    >
                                        Đăng xuất
                                    </NavDropdown.Item>
                                </>
                            )}
                            {userAccount?.accessToken ? (
                                ""
                            ) : (
                                <>
                                    <NavDropdown.Item
                                        as={Link}
                                        to={"/dang-nhap"}
                                    >
                                        Đăng nhập
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to={"/dang-ky"}>
                                        Đăng ký
                                    </NavDropdown.Item>
                                </>
                            )}
                        </NavDropdown>
                        <Nav.Item>
                            Xin Chào{" "}
                            <span className="fw-bold">
                                {userAccount?.accessToken &&
                                userAccount.fullName
                                    ? userAccount.fullName
                                    : "Bạn"}
                            </span>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default MainHeader;
