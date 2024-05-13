// components/InfoUser.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    requestGetInfoUser,
    deleteDepenPost,
    deletePost,
    requestDeletePost,
    requestDeleteComment,
} from "../../../redux/requestApi/postsApiThunk";
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
    const [showModal, setShowModal] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState({ type: "", id: null });

    useEffect(() => {
        // dispatch(requestGetInfoUser());
    }, [dispatch]);

    const handleDelete = (type, id) => {
        setDeleteInfo({ type, id });
        setShowModal(true);
    };

    const confirmDelete = () => {
        if (deleteInfo.type === "post") {
            dispatch(requestDeletePost({ idPost: deleteInfo.id }));
        } else if (deleteInfo.type === "depenPost") {
            dispatch(requestDeleteComment({ idComment: deleteInfo.id }));
        }
        setShowModal(false);
    };

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
                        <Card.Title>{listInfoUser.email}</Card.Title>
                        <Card.Text>
                            <strong>Full Name: </strong>
                            {listInfoUser.fullName}
                        </Card.Text>
                        <Card.Title>Posts</Card.Title>
                        <ListGroup variant="flush">
                            {listInfoUser.Posts.map((post) => (
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
                                                Delete Post
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
                                                                        Delete
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
