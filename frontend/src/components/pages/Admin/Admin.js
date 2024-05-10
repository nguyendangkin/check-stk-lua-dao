import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, Form, Modal } from "react-bootstrap";
import {
    requestBanAccount,
    requestDeleteUser,
    requestGetFilteredUsers,
} from "../../../redux/requestApi/usersApiThunk";
import { setFilteredUsers } from "../../../redux/reducer/usersApiSlice";
import ReactPaginate from "react-paginate";
import { useDebounce } from "../../../HooksCustomer/debounce";
import className from "classnames/bind";
import styles from "./Admin.module.scss";

const cx = className.bind(styles);

const Admin = () => {
    const dispatch = useDispatch();
    const searchResults = useSelector((state) => state?.users?.searchResults); // Lấy kết quả tìm kiếm từ Redux store
    const totalUsers = useSelector((state) => state?.users?.totalUsers); // Lấy tổng số người dùng từ Redux store
    const [searchKeyword, setSearchKeyword] = useState(""); // Trạng thái từ khóa tìm kiếm
    const [pageCount, setPageCount] = useState(0); // Số lượng trang
    const [itemOffset, setItemOffset] = useState(0); // Vị trí của mục
    const usersPerPage = 5; // Số người dùng mỗi trang
    const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
    const [showModal, setShowModal] = useState(false); // Trạng thái hiển thị modal xóa
    const [selectedUser, setSelectedUser] = useState(null); // Người dùng được chọn để xóa
    const [showBanModal, setShowBanModal] = useState(false); // Trạng thái hiển thị modal ban
    const [userToBan, setUserToBan] = useState(null); // Người dùng được chọn để ban

    const debouncedKeyword = useDebounce(searchKeyword, 500); // Debounce từ khóa tìm kiếm

    // Load danh sách người dùng khi từ khóa tìm kiếm hoặc vị trí trang thay đổi
    useEffect(() => {
        dispatch(
            requestGetFilteredUsers({
                searchKeyword: debouncedKeyword,
                limit: usersPerPage,
                offset: itemOffset,
            })
        );
    }, [debouncedKeyword, itemOffset, dispatch, usersPerPage]);

    // Tính toán số trang dựa trên tổng số người dùng
    useEffect(() => {
        setPageCount(Math.ceil(totalUsers / usersPerPage));
    }, [totalUsers, usersPerPage]);

    // Xử lý khi người dùng chuyển trang
    const handlePageClick = (event) => {
        const newOffset = event.selected * usersPerPage;
        setItemOffset(newOffset);
        setCurrentPage(event.selected);
    };

    // Xử lý yêu cầu xóa tài khoản
    const handleDelete = (userId) => {
        setShowModal(true);
        setSelectedUser(userId);
    };

    const confirmDelete = () => {
        dispatch(requestDeleteUser({ id: selectedUser }))
            .then(() => {
                // Gọi lại hàm tải dữ liệu người dùng sau khi xóa thành công
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

    // Xử lý yêu cầu ban tài khoản
    const handleBanClick = (userId) => {
        setUserToBan(userId);
        setShowBanModal(true);
    };

    const confirmBan = () => {
        dispatch(requestBanAccount({ id: userToBan }))
            .then(() => {
                // Cập nhật lại danh sách người dùng hoặc thông báo người dùng đã bị ban
                setShowBanModal(false);
                setUserToBan(null);
            })
            .catch((error) => {
                console.error("Error banning user:", error);
                setShowBanModal(false);
                setUserToBan(null);
            });
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
                                <Button className="me-2 mt-1">
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
