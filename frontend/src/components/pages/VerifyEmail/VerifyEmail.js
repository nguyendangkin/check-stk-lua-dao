import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { requestVerifyCodeRegister } from "../../../redux/requestApi/userAccountThunk";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Form, Container, Row, Col } from "react-bootstrap";

function VerifyEmail() {
    const [code, setCode] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAuthenticating = useSelector(
        (state) => state?.user?.isAuthenticating
    );

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        dispatch(requestVerifyCodeRegister({ code: code })) // Assume this action needs the code
            .then((result) => {
                if (result.payload.EC === 0) {
                    toast.success(result.payload.EM);
                    navigate("/dang-nhap");
                } else {
                    toast.error(result.payload.EM);
                }
            })
            .catch((error) => {
                toast.error("Có lỗi khi xác minh email.");
            });
    };

    useEffect(() => {
        // Giả sử bạn lưu trạng thái xác thực trong localStorage

        // Nếu không trong quá trình xác thực, chuyển hướng người dùng
        if (!isAuthenticating) {
            navigate("/"); // Hoặc bất cứ đâu tùy theo logic của bạn
        }
    }, [navigate]);

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center mb-5">
                <Col xs={12} md={6}>
                    <h1 className="text-center">Xác thực Email</h1>
                    <Form>
                        <Form.Group>
                            <Form.Label>
                                Nhập mã Code mà bạn nhận từ Email
                            </Form.Label>
                            <Form.Control
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Mã code 6 chữ số"
                                required
                            />
                        </Form.Group>
                        <Button
                            className="mt-2"
                            variant="primary"
                            onClick={handleSubmit}
                        >
                            Xác thực
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default VerifyEmail;
