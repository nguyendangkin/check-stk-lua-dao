import Nav from "react-bootstrap/Nav";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import { jwtDecode } from "jwt-decode";
import styles from "./MainHeader.module.scss";
import { useState } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { requestLogout } from "../../../redux/requestApi/userAccountThunk";
import { logOut } from "../../../redux/reducer/userAccountSlice";
import userAvatar from "./../../../images/user.png";

// Bind styles using classnames
// Gắn kết các styles sử dụng classnames
const cx = classNames.bind(styles);

// MainHeader component for the application header
// Component MainHeader cho header của ứng dụng
function MainHeader() {
    const userAccount = useSelector((state) => state.user?.userAccount);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState(false);

    // Decode the JWT to extract user roles
    let userRole = "";
    if (userAccount?.accessToken) {
        const decodedToken = jwtDecode(userAccount.accessToken);
        userRole = decodedToken.roles.roleName; // Correcting the path to the role name
    }
    const handleOnClick = () => setIsActive(!isActive);

    const handleLogout = () => {
        dispatch(requestLogout());
        dispatch(logOut());
        navigate("/");
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
                                Hướng dẫn sử dụng
                            </Nav.Link>
                        </Nav.Item>
                        <NavDropdown
                            title={
                                <button
                                    onClick={handleOnClick}
                                    className={cx("avatar-button")}
                                >
                                    <img
                                        src={userAvatar}
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
                                    {userAccount?.accessToken &&
                                        userRole === "admin" && (
                                            <NavDropdown.Item
                                                as={Link}
                                                to="/admin"
                                            >
                                                Quản lý người dùng
                                            </NavDropdown.Item>
                                        )}
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
