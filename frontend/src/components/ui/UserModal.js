import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const UserModal = ({
    show,
    onHide,
    onSave,
    userForm,
    handleChange,
    isEditing,
    onExited,
}) => {
    return (
        <Modal show={show} onHide={onHide} onExited={onExited}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {isEditing ? "Sửa Người Dùng" : "Thêm Người Dùng"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={userForm?.email || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Họ Tên</Form.Label>
                        <Form.Control
                            type="text"
                            name="fullName"
                            value={userForm?.fullName || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={onSave}>
                    {isEditing ? "Cập nhật" : "Lưu"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UserModal;
