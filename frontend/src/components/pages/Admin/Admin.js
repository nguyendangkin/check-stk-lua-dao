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

const Admin = () => {
    const dispatch = useDispatch();
    const searchResults = useSelector((state) => state?.users?.searchResults); // Lấy kết quả tìm kiếm từ Redux store
    const totalUsers = useSelector((state) => state?.users?.totalUsers); // Lấy tổng số người dùng từ Redux store
    const [searchKeyword, setSearchKeyword] = useState("");
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const usersPerPage = 5; // Số người dùng mỗi trang
    const [currentPage, setCurrentPage] = useState(0); // Trạng thái để theo dõi trang hiện tại
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showBanModal, setShowBanModal] = useState(false);
    const [userToBan, setUserToBan] = useState(null);

    const debouncedKeyword = useDebounce(searchKeyword, 500);

    // Xử lý tìm kiếm và phân trang người dùng
    useEffect(() => {
        if (debouncedKeyword.trim() !== "") {
            dispatch(
                requestGetFilteredUsers({
                    searchKeyword: debouncedKeyword,
                    limit: usersPerPage,
                    offset: itemOffset,
                })
            );
        } else {
            dispatch(setFilteredUsers());
        }
    }, [debouncedKeyword, itemOffset, dispatch, usersPerPage]);

    // Tính toán số trang dựa trên tổng số người dùng
    useEffect(() => {
        setPageCount(Math.ceil(totalUsers / usersPerPage));
    }, [totalUsers, usersPerPage]);

    // Cập nhật lại vị trí trang khi từ khóa tìm kiếm thay đổi
    useEffect(() => {
        setCurrentPage(0);
        setItemOffset(0);
    }, [debouncedKeyword]);

    // Xử lý khi người dùng chuyển trang
    const handlePageClick = (event) => {
        const newOffset = event.selected * usersPerPage;
        setItemOffset(newOffset);
        setCurrentPage(event.selected);
    };

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

    // ban account
    const handleBanClick = (userId) => {
        setUserToBan(userId);
        setShowBanModal(true);
    };

    const confirmBan = () => {
        dispatch(requestBanAccount({ id: userToBan }))
            .then(() => {
                // Optional: Update the user list or indicate a user has been banned
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
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Họ Tên</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {searchResults.map((user, index) => (
                        <tr key={`user-${index}`}>
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
                            <td>
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
            {pageCount > 0 && (
                <ReactPaginate
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={pageCount}
                    previousLabel="< previous"
                    forcePage={currentPage} // Đặt currentPage khi đã đảm bảo pageCount > 0
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName="active"
                    renderOnZeroPageCount={null}
                />
            )}
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
