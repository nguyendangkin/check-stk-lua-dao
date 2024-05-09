import React, { useEffect, useState } from "react";
import { Form, Button, Col, Row, Container, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { requestLogin } from "../../../redux/requestApi/userAccountThunk";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const loading = useSelector((state) => state.user?.loading);
    const accessToken = useSelector(
        (state) => state.user?.userAccount?.accessToken
    );

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (accessToken) {
            navigate("/");
        }
    }, [accessToken, navigate]);

    // Định nghĩa schema kiểm tra xác thực bằng Yup
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Email không đúng định dạng.")
            .required("Email không được bỏ trống."),
        password: Yup.string().required("Mật khẩu không được bỏ trống."),
    });

    const handleLogin = () => {
        const formValues = {
            email: email.trim(),
            password: password.trim(),
        };

        try {
            validationSchema.validateSync(formValues, { abortEarly: false });
            setErrors({});
        } catch (validationError) {
            const newErrors = {};
            validationError.errors.forEach((error) => {
                if (error.includes("Email")) newErrors.email = error;
                if (error.includes("Mật khẩu")) newErrors.password = error;
            });
            setErrors(newErrors);
            return;
        }

        dispatch(requestLogin(formValues))
            .then((result) => {
                if (result.payload.EC === 0) {
                    navigate("/");
                } else {
                    toast.error(result.payload.EM);
                }
            })
            .catch((error) => {
                toast.error("Có lỗi xảy ra khi đăng nhập.");
            });
    };

    const handleInputChange = (field, value) => {
        switch (field) {
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
            default:
                break;
        }

        // Xóa lỗi liên quan đến trường cụ thể
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <Row className="justify-content-center">
            <Col xs={12} md={6}>
                <Form
                    className="mt-4 mb-4 p-4 border rounded-3 bg-light"
                    onKeyPress={handleKeyPress}
                >
                    <h2 className="text-center">Đăng nhập</h2>

                    <Form.Group controlId="email">
                        <Form.Label className="mt-2">
                            Email <span style={{ color: "red" }}> *</span>
                        </Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) =>
                                handleInputChange("email", e.target.value)
                            }
                        />
                        {errors.email && (
                            <Alert variant="danger" className="mt-2">
                                {errors.email}
                            </Alert>
                        )}
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label className="mt-2">
                            Mật khẩu <span style={{ color: "red" }}> *</span>
                        </Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) =>
                                handleInputChange("password", e.target.value)
                            }
                        />
                        {errors.password && (
                            <Alert variant="danger" className="mt-2">
                                {errors.password}
                            </Alert>
                        )}
                    </Form.Group>

                    <div className="d-flex justify-content-center flex-column">
                        <Button
                            variant="success"
                            onClick={handleLogin}
                            disabled={loading}
                            className="mt-3 mb-1"
                        >
                            Đăng nhập
                        </Button>

                        <p className="mt-3">
                            Bạn chưa có tài khoản?{" "}
                            <Link to="/dang-ky">Đăng ký tại đây</Link>.
                        </p>

                        <p>
                            Quên mật khẩu?{" "}
                            <Link to="/quen-mat-khau">Lấy lại tại đây</Link>.
                        </p>
                    </div>
                </Form>
            </Col>
        </Row>
    );
};

export default Login;
