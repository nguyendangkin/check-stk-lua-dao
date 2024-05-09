import React, { useEffect, useState } from "react";
import { Form, Button, Col, Row, Container, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { requestRegister } from "../../../redux/requestApi/userAccountThunk";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { authenticating } from "../../../redux/reducer/userAccountSlice";

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});

    const loading = useSelector((state) => state.user.loading);
    const accessToken = useSelector(
        (state) => state.user?.userAccount?.accessToken
    );

    useEffect(() => {
        if (accessToken) {
            navigate("/");
        }
    }, [accessToken, navigate]);

    // Định nghĩa schema kiểm tra xác thực bằng Yup
    const validationSchema = Yup.object().shape({
        fullName: Yup.string().required("Tên đầy đủ không được bỏ trống."),
        email: Yup.string()
            .email("Email không đúng định dạng.")
            .required("Email không được bỏ trống."),
        password: Yup.string()
            .min(6, "Mật khẩu phải có ít nhất 6 ký tự.")
            .required("Mật khẩu không được bỏ trống."),
        confirmPassword: Yup.string()
            .required("Nhập lại mật khẩu mới không được bỏ trống.")
            .oneOf([Yup.ref("password")], "Nhập lại mật khẩu mới không khớp."),
    });

    const handleRegisterClick = () => {
        const formValues = {
            fullName: fullName.trim(),
            email: email.trim(),
            password: password.trim(),
            confirmPassword: confirmPassword.trim(),
        };

        try {
            validationSchema.validateSync(formValues, { abortEarly: false });
            setErrors({});
        } catch (validationError) {
            const newErrors = {};
            validationError.errors.forEach((error) => {
                if (error.includes("Tên đầy đủ")) newErrors.fullName = error;
                if (error.includes("Email")) newErrors.email = error;
                if (error.includes("Mật khẩu")) newErrors.password = error;
                if (error.includes("Nhập lại mật khẩu"))
                    newErrors.confirmPassword = error;
            });
            setErrors(newErrors);
            return;
        }

        dispatch(requestRegister(formValues))
            .then((result) => {
                if (result.payload.EC === 0) {
                    toast.success(result.payload.EM);
                    dispatch(authenticating());
                    navigate("/xac-thuc-dang-ky");
                } else {
                    toast.error(result.payload.EM);
                }
            })
            .catch((error) => {
                toast.error("Có lỗi xảy ra khi đăng ký.");
            });
    };

    const handleInputChange = (field, value) => {
        switch (field) {
            case "fullName":
                setFullName(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
            case "confirmPassword":
                setConfirmPassword(value);
                break;
            default:
                break;
        }

        // Xóa lỗi liên quan đến trường cụ thể
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    return (
        <Row className="justify-content-center">
            <Col xs={12} md={6}>
                <Form className="mt-4 mb-4 p-4 border rounded-3 bg-light">
                    <h2 className="text-center">Đăng ký</h2>

                    <Form.Group controlId="fullName">
                        <Form.Label className="mt-2">
                            Tên đầy đủ <span style={{ color: "red" }}> *</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={fullName}
                            onChange={(e) =>
                                handleInputChange("fullName", e.target.value)
                            }
                        />
                        {errors.fullName && (
                            <Alert variant="danger" className="mt-2">
                                {errors.fullName}
                            </Alert>
                        )}
                    </Form.Group>

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
                            Mật khẩu{" "}
                            <span style={{ color: "red" }}>
                                {" "}
                                * (Ít nhất 6 ký tự)
                            </span>
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

                    <Form.Group controlId="confirmPassword">
                        <Form.Label className="mt-2">
                            Nhập lại mật khẩu{" "}
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
                        />
                        {errors.confirmPassword && (
                            <Alert variant="danger" className="mt-2">
                                {errors.confirmPassword}
                            </Alert>
                        )}
                    </Form.Group>

                    <div className="d-flex justify-content-center flex-column">
                        <Button
                            variant="success"
                            onClick={handleRegisterClick}
                            disabled={loading}
                            className="mt-3 mb-1"
                        >
                            Đăng ký
                        </Button>

                        <p className="mt-3">
                            Bạn đã có tài khoản?{" "}
                            <Link to="/dang-nhap">Đăng nhập tại đây</Link>.
                        </p>
                    </div>
                </Form>
            </Col>
        </Row>
    );
};
export default Register;
