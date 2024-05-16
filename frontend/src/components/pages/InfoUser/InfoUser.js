import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    requestGetInfoUser,
    requestDeletePost,
    requestDeleteComment,
    requestDeleteAllComment,
} from "../../../redux/requestApi/postsApiThunk";
import ReactPaginate from "react-paginate";
import {
    Card,
    ListGroup,
    Container,
    Row,
    Col,
    Button,
    Modal,
} from "react-bootstrap";

const InfoUser = () => {
    const dispatch = useDispatch();
    const listInfoUser = useSelector((state) => state.posts?.listInfoUser);
    const totalPosts = useSelector(
        (state) => state.posts?.listInfoUser?.totalPosts
    );
    const idInfoUser = useSelector((state) => state.posts?.idInfoUser);
    const [showModal, setShowModal] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState({ type: "", id: null });
    const itemsPerPage = 5; // Number of items per page
    // Handle delete action
    // Xử lý hành động xóa
    const handleDelete = (type, id) => {
        setDeleteInfo({ type, id });
        setShowModal(true);
    };

    // Handle delete all comments for a post
    // Xử lý xóa tất cả bình luận cho một bài viết
    const handleDeleteAllComment = (postId) => {
        dispatch(
            requestDeleteAllComment({ idPost: postId, idUser: idInfoUser })
        )
            .then(() => {
                dispatch(requestGetInfoUser({ idUser: idInfoUser }));
            })
            .catch(() => {});
    };

    // Handle page click for pagination
    // Xử lý nhấp trang cho phân trang
    const handlePageClick = (data) => {
        const currentPage = data.selected + 1; // `data.selected` là chỉ số trang được chọn, bắt đầu từ 0
        dispatch(
            requestGetInfoUser({
                idUser: idInfoUser,
                page: currentPage,
                pageSize: itemsPerPage,
            })
        );
    };

    // Confirm delete action
    // Xác nhận hành động xóa
    const confirmDelete = () => {
        if (deleteInfo.type === "post") {
            dispatch(
                requestDeletePost({ idPost: deleteInfo.id, idUser: idInfoUser })
            )
                .then(() => {
                    dispatch(requestGetInfoUser({ idUser: idInfoUser }));
                })
                .catch(() => {});
        } else if (deleteInfo.type === "depenPost") {
            dispatch(requestDeleteComment({ idComment: deleteInfo.id }))
                .then(() => {
                    dispatch(requestGetInfoUser({ idUser: idInfoUser }));
                })
                .catch(() => {});
        }
        setShowModal(false);
    };

    // Cancel delete action
    // Hủy hành động xóa
    const cancelDelete = () => {
        setShowModal(false);
        setDeleteInfo({ type: "", id: null });
    };

    return (
        <Container>
            {listInfoUser && (
                <Card>
                    <Card.Header>User Information</Card.Header>
                    <Card.Body>
                        <Card.Title>{listInfoUser.user.email}</Card.Title>
                        <Card.Text>
                            <strong>Full Name: </strong>
                            {listInfoUser.user.fullName}
                        </Card.Text>
                        <Card.Title>Posts</Card.Title>
                        <ListGroup variant="flush">
                            {listInfoUser.posts.map((post) => (
                                <ListGroup.Item key={post.id}>
                                    <Card>
                                        <Card.Header>
                                            Post ID: {post.id}
                                            <Button
                                                variant="danger"
                                                className="float-end"
                                                onClick={() =>
                                                    handleDelete(
                                                        "post",
                                                        post.id
                                                    )
                                                }
                                            >
                                                Xóa số tài khoản
                                            </Button>
                                            <Button
                                                className="ms-4"
                                                variant="warning"
                                                onClick={() =>
                                                    handleDeleteAllComment(
                                                        post.id
                                                    )
                                                }
                                            >
                                                Xóa mọi bình luận
                                            </Button>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col>
                                                    <Card.Text>
                                                        <strong>
                                                            Account Number:{" "}
                                                        </strong>
                                                        {post.accountNumber}
                                                    </Card.Text>
                                                    <Card.Text>
                                                        <strong>
                                                            Account Name:{" "}
                                                        </strong>
                                                        {post.accountName}
                                                    </Card.Text>
                                                    <Card.Text>
                                                        <strong>
                                                            Bank Name:{" "}
                                                        </strong>
                                                        {post.bankName}
                                                    </Card.Text>
                                                </Col>
                                            </Row>
                                            <Card.Title>
                                                Dependent Posts (Comments)
                                            </Card.Title>
                                            <ListGroup variant="flush">
                                                {post.DepenPosts.map(
                                                    (depenPost) => (
                                                        <ListGroup.Item
                                                            key={depenPost.id}
                                                        >
                                                            <Card>
                                                                <Card.Body>
                                                                    <Card.Text>
                                                                        <strong>
                                                                            Evidence
                                                                            Link:{" "}
                                                                        </strong>
                                                                        <a
                                                                            href={
                                                                                depenPost.evidenceLink
                                                                            }
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                        >
                                                                            {
                                                                                depenPost.evidenceLink
                                                                            }
                                                                        </a>
                                                                    </Card.Text>
                                                                    <Card.Text>
                                                                        <strong>
                                                                            Advice:{" "}
                                                                        </strong>
                                                                        {
                                                                            depenPost.advice
                                                                        }
                                                                    </Card.Text>
                                                                    <Button
                                                                        variant="warning"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                "depenPost",
                                                                                depenPost.id
                                                                            )
                                                                        }
                                                                    >
                                                                        Xóa bình
                                                                        luận
                                                                    </Button>
                                                                </Card.Body>
                                                            </Card>
                                                        </ListGroup.Item>
                                                    )
                                                )}
                                            </ListGroup>
                                        </Card.Body>
                                    </Card>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card.Body>
                </Card>
            )}
            <ReactPaginate
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                pageCount={Math.ceil(totalPosts / itemsPerPage)} // Tính toán tổng số trang
                previousLabel="<"
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
            />
            <Modal show={showModal} onHide={cancelDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this {deleteInfo.type}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cancelDelete}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default InfoUser;
