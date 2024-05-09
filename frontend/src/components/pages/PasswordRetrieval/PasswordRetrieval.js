import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    Alert,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
    requestCodeEmail,
    requestPassRetri,
} from "../../../redux/requestApi/userAccountThunk";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const PasswordRetrieval = () => {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [countdown, setCountdown] = useState(0);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Schema validation for sending code
    const sendCodeSchema = Yup.object().shape({
        email: Yup.string()
            .email("Email không đúng định dạng.")
            .required("Email không được bỏ trống."),
    });

    // Schema validation for changing password
    const changePasswordSchema = Yup.object().shape({
        email: Yup.string()
            .email("Email không đúng định dạng.")
            .required("Email không được bỏ trống."),
        code: Yup.string()
            .matches(/^\d{6}$/, "Mã xác thực phải là 6 chữ số.")
            .required("Mã không được để trống."),
        newPassword: Yup.string()
            .min(6, "Mật khẩu phải có ít nhất 6 ký tự.")
            .required("Mật khẩu mới không được bỏ trống."),
        confirmPassword: Yup.string()
            .required("Nhập lại mật khẩu mới không được bỏ trống.")
            .oneOf(
                [Yup.ref("newPassword")],
                "Nhập lại mật khẩu mới không khớp."
            ),
    });

    const handleSendCode = () => {
        const formValues = { email: email.trim() };

        try {
            sendCodeSchema.validateSync(formValues, { abortEarly: false });
            setErrors({});
        } catch (validationError) {
            const newErrors = {};
            validationError.errors.forEach((error) => {
                if (error.includes("Email")) newErrors.email = error;
            });
            setErrors(newErrors);
            return;
        }

        dispatch(requestCodeEmail({ email: email.trim() }))
            .then((result) => {
                if (result.payload.EC === 0) {
                    toast.success(result.payload.EM);
                } else {
                    toast.error(result.payload.EM);
                }
            })
            .catch(() => {
                toast.error("Có lỗi xảy ra khi gửi mã Code.");
            });
        setCountdown(60);
    };

    const handleChangePassword = () => {
        const formValues = {
            email: email.trim(),
            code: code.trim(),
            newPassword: newPassword.trim(),
            confirmPassword: confirmPassword.trim(),
        };

        try {
            changePasswordSchema.validateSync(formValues, {
                abortEarly: false,
            });
            setErrors({});
        } catch (validationError) {
            const newErrors = {};
            validationError.errors.forEach((error) => {
                if (error.includes("Email")) newErrors.email = error;
                if (error.includes("Mã")) newErrors.code = error;
                if (error.includes("Mật khẩu")) newErrors.newPassword = error;
                if (error.includes("Nhập lại mật khẩu"))
                    newErrors.confirmPassword = error;
            });
            setErrors(newErrors);
            return;
        }

        dispatch(requestPassRetri(formValues))
            .then((result) => {
                if (result.payload.EC === 0) {
                    toast.success(result.payload.EM);
                    navigate("/dang-nhap");
                } else {
                    toast.error(result.payload.EM);
                }
            })
            .catch(() => {
                toast.error("Có lỗi xảy ra khi đổi mật khẩu.");
            });
    };

    const handleInputChange = (field, value) => {
        switch (field) {
            case "email":
                setEmail(value);
                break;
            case "code":
                setCode(value);
                break;
            case "newPassword":
                setNewPassword(value);
                break;
            case "confirmPassword":
                setConfirmPassword(value);
                break;
            default:
                break;
        }

        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };
    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card body>
                        <h5 className="text-center">Lấy Lại Mật Khẩu</h5>

                        <Form>
                            <Form.Group controlId="email">
                                <Form.Label>
                                    Email{" "}
                                    <span style={{ color: "red" }}> *</span>
                                </Form.Label>
                                <div className="d-flex">
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Nhập email của bạn để"
                                    />
                                    <Button
                                        onClick={handleSendCode}
                                        disabled={countdown > 0}
                                        className="ms-2"
                                    >
                                        {countdown > 0
                                            ? `${countdown}s`
                                            : "Lấy Mã Code"}
                                    </Button>
                                </div>
                                {errors.email && (
                                    <Alert variant="danger" className="mt-2">
                                        {errors.email}
                                    </Alert>
                                )}
                            </Form.Group>

                            <Form.Group controlId="code" className="mt-2">
                                <Form.Label>
                                    Mã Code{" "}
                                    <span style={{ color: "red" }}> *</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={code}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "code",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Nhập mã Code (6 chữ số) từ Email để xác nhận"
                                />
                                {errors.code && (
                                    <Alert variant="danger" className="mt-2">
                                        {errors.code}
                                    </Alert>
                                )}
                            </Form.Group>

                            <Form.Group
                                controlId="newPassword"
                                className="mt-2"
                            >
                                <Form.Label>
                                    Mật khẩu Mới{" "}
                                    <span style={{ color: "red" }}>
                                        {" "}
                                        * (Ít nhất 6 ký tự)
                                    </span>
                                </Form.Label>
                                <Form.Control
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "newPassword",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Nhập mật khẩu mới"
                                />
                                {errors.newPassword && (
                                    <Alert variant="danger" className="mt-2">
                                        {errors.newPassword}
                                    </Alert>
                                )}
                            </Form.Group>

                            <Form.Group
                                controlId="confirmPassword"
                                className="mt-2"
                            >
                                <Form.Label>
                                    Nhập Lại Mật khẩu Mới{" "}
                                    <span style={{ color: "red" }}> *</span>
                                </Form.Label>
                                <Form.Control
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "confirmPassword",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Nhập lại mật khẩu mới"
                                />
                                {errors.confirmPassword && (
                                    <Alert variant="danger" className="mt-2">
                                        {errors.confirmPassword}
                                    </Alert>
                                )}
                            </Form.Group>

                            <Button
                                variant="success"
                                onClick={handleChangePassword}
                                className="mt-4"
                            >
                                Đổi Mật Khẩu
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};
export default PasswordRetrieval;
