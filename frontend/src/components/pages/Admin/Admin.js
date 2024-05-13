import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, Form, Modal } from "react-bootstrap";
import {
    requestBanAccount,
    requestDeleteUser,
    requestGetFilteredUsers,
} from "../../../redux/requestApi/usersApiThunk";
import ReactPaginate from "react-paginate";
import { useDebounce } from "../../../HooksCustomer/debounce";
import className from "classnames/bind";
import { useNavigate } from "react-router-dom";
import styles from "./Admin.module.scss";
import { setIdInfoUser } from "../../../redux/reducer/postsApiSlice";
import { requestGetInfoUser } from "../../../redux/requestApi/postsApiThunk";

const cx = className.bind(styles);

// Admin component for user management
// Component Admin để quản lý người dùng
const Admin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Get search results and total users from Redux store
    // Lấy kết quả tìm kiếm và tổng số người dùng từ Redux store
    const searchResults = useSelector((state) => state?.users?.searchResults);
    const totalUsers = useSelector((state) => state?.users?.totalUsers);

    // State for search keyword
    // State cho từ khóa tìm kiếm
    const [searchKeyword, setSearchKeyword] = useState("");

    // State for pagination control
    // State để điều khiển phân trang
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);

    // Number of users per page
    // Số người dùng mỗi trang
    const usersPerPage = 5;
    const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại

    // State for modal controls
    // State để điều khiển modal
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showBanModal, setShowBanModal] = useState(false);
    const [userToBan, setUserToBan] = useState(null);

    // Debounce the search keyword to reduce API calls
    // Debounce từ khóa tìm kiếm để giảm số lần gọi API
    const debouncedKeyword = useDebounce(searchKeyword, 500);

    // Load user list when search keyword or page offset changes
    // Tải danh sách người dùng khi từ khóa tìm kiếm hoặc vị trí trang thay đổi
    useEffect(() => {
        dispatch(
            requestGetFilteredUsers({
                searchKeyword: debouncedKeyword,
                limit: usersPerPage,
                offset: itemOffset,
            })
        );
    }, [debouncedKeyword, itemOffset, dispatch, usersPerPage]);

    // Calculate page count based on total users
    // Tính toán số trang dựa trên tổng số người dùng
    useEffect(() => {
        setPageCount(Math.ceil(totalUsers / usersPerPage));
    }, [totalUsers, usersPerPage]);

    // Handle page click event for pagination
    // Xử lý sự kiện click để phân trang
    const handlePageClick = (event) => {
        const newOffset = event.selected * usersPerPage;
        setItemOffset(newOffset);
        setCurrentPage(event.selected);
    };

    // Handle delete account request
    // Xử lý yêu cầu xóa tài khoản
    const handleDelete = (userId) => {
        setShowModal(true);
        setSelectedUser(userId);
    };

    // Confirm and perform account deletion
    // Xác nhận và thực hiện xóa tài khoản
    const confirmDelete = () => {
        dispatch(requestDeleteUser({ id: selectedUser }))
            .then(() => {
                // Reload user list after successful deletion
                // Tải lại danh sách người dùng sau khi xóa thành công
                dispatch(
                    requestGetFilteredUsers({
                        searchKeyword: debouncedKeyword,
                        limit: usersPerPage,
                        offset: itemOffset,
                    })
                );
            })
            .catch((error) => {
                console.error("Error deleting user:", error);
            });
        setShowModal(false);
        setSelectedUser(null);
    };

    // Handle ban account request
    // Xử lý yêu cầu ban tài khoản
    const handleBanClick = (userId) => {
        setUserToBan(userId);
        setShowBanModal(true);
    };

    // Confirm and perform account ban
    // Xác nhận và thực hiện ban tài khoản
    const confirmBan = () => {
        dispatch(requestBanAccount({ id: userToBan }))
            .then(() => {
                // Update user list or notify user has been banned
                // Cập nhật danh sách người dùng hoặc thông báo người dùng đã bị ban
                setShowBanModal(false);
                setUserToBan(null);
            })
            .catch((error) => {
                console.error("Error banning user:", error);
                setShowBanModal(false);
                setUserToBan(null);
            });
    };

    const handleViewInfoUser = (idUser) => {
        dispatch(requestGetInfoUser({ idUser: idUser }))
            .then(() => {
                dispatch(setIdInfoUser(idUser));
                navigate("/thong-tin-nguoi-dung");
            })
            .catch((error) => {});
    };

    return (
        <div className="container">
            <h2 className="mt-4 mb-4">Quản lý người dùng</h2>
            <Form.Control
                type="text"
                placeholder="Search"
                className="mr-sm-2 mb-2"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <Table striped bordered hover>
                <thead>
                    <tr className={cx("header")}>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Họ Tên</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {searchResults.map((user, index) => (
                        <tr key={`user-${index}`} className={cx("body")}>
                            <td>
                                {user.groupId === 3 ? (
                                    <del>{user.id}</del>
                                ) : (
                                    user.id
                                )}
                            </td>
                            <td>
                                {user.groupId === 3 ? (
                                    <del>{user.email}</del>
                                ) : (
                                    user.email
                                )}
                            </td>
                            <td>
                                {user.groupId === 3 ? (
                                    <del>{user.fullName}</del>
                                ) : (
                                    user.fullName
                                )}
                            </td>
                            <td className={cx("action")}>
                                <Button
                                    onClick={() => handleViewInfoUser(user.id)}
                                    className="me-2 mt-1"
                                >
                                    Xem các bài post
                                </Button>
                                <Button
                                    variant="warning"
                                    className="me-2 mt-1"
                                    disabled={user.groupId === 3}
                                    onClick={() => handleBanClick(user.id)}
                                >
                                    Ban tài khoản
                                </Button>
                                <Button
                                    variant="danger"
                                    className="me-2 mt-1"
                                    onClick={() => handleDelete(user.id)}
                                >
                                    Xóa tài khoản
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="d-flex justify-content-center">
                {pageCount > 0 && (
                    <ReactPaginate
                        nextLabel=">"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={2}
                        pageCount={pageCount}
                        previousLabel="<"
                        forcePage={currentPage}
                        pageClassName={cx("page-item")}
                        pageLinkClassName={cx("page-link")}
                        previousClassName={cx("page-item")}
                        previousLinkClassName={cx("page-link")}
                        nextClassName={cx("page-item")}
                        nextLinkClassName={cx("page-link")}
                        breakLabel="..."
                        breakClassName={cx("page-item", "break")}
                        breakLinkClassName={cx("page-link")}
                        containerClassName={cx("pagination")}
                        activeClassName={cx("active")}
                        renderOnZeroPageCount={null}
                    />
                )}
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa tài khoản này không?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowModal(false)}
                    >
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Xóa Tài Khoản
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showBanModal} onHide={() => setShowBanModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận ban</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn ban tài khoản này không?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowBanModal(false)}
                    >
                        Hủy
                    </Button>
                    <Button variant="warning" onClick={confirmBan}>
                        Ban tài khoản
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Admin;
