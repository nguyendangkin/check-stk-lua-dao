import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Card,
    Tooltip,
    OverlayTrigger,
    Modal,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { requestPostScam } from "../../../redux/requestApi/usersApiThunk";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import * as Yup from "yup";

// Validation schema for account details
// Schema xác thực cho chi tiết tài khoản
const accountSchema = Yup.object().shape({
    accountNumber: Yup.string()
        .matches(/^\d+$/, "Số Tài Khoản chỉ chứa số")
        .required("Số Tài Khoản là bắt buộc"),
    accountName: Yup.string()
        .matches(
            /^[a-zA-Z\s]+$/,
            "Tên Chủ Tài Khoản chỉ chứa chữ cái không dấu"
        )
        .required("Tên Chủ Tài Khoản là bắt buộc"),
    bankName: Yup.string()
        .required("Tên Hệ Thống Thanh Toán là bắt buộc")
        .matches(
            /^[a-zA-Z\s]+$/,
            "Tên Hệ Thống Thanh Toán chỉ chứa chữ cái không dấu"
        ),
    evidenceLink: Yup.string()
        .url("Link minh chứng không hợp lệ")
        .required("Link minh chứng là bắt buộc"),
    advice: Yup.string().required("Lời khuyên là bắt buộc"),
});

// PostScam component for reporting scam accounts
// Component PostScam để báo cáo các tài khoản lừa đảo
const PostScam = () => {
    const accessToken = useSelector(
        (state) => state.user?.userAccount?.accessToken
    );

    const loading = useSelector((state) => state.users?.loading);

    const [accounts, setAccounts] = useState([]);
    const [newAccount, setNewAccount] = useState({
        accountNumber: "",
        accountName: "",
        bankName: "",
        evidenceLink: "",
        advice: "",
    });

    const dispatch = useDispatch();

    const [showModal, setShowModal] = useState(false);
    const [modalIndex, setModalIndex] = useState(null);

    // Generate a random math problem for verification
    // Tạo bài toán ngẫu nhiên để xác minh
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [userAnswer, setUserAnswer] = useState("");

    const createMathProblem = () => {
        const n1 = Math.floor(Math.random() * 10);
        const n2 = Math.floor(Math.random() * 10);

        setNum1(n1);
        setNum2(n2);
    };

    useEffect(createMathProblem, []);

    // Update new account details
    // Cập nhật chi tiết tài khoản mới
    const updateNewAccount = async (field, value) => {
        setNewAccount({
            ...newAccount,
            [field]: value,
        });
    };

    // Add a new account to the list
    // Thêm tài khoản mới vào danh sách
    const addAccount = async () => {
        try {
            // Trim and validate data
            const trimmedAccount = {
                accountNumber: newAccount.accountNumber.trim(),
                accountName: newAccount.accountName.trim(),
                bankName: newAccount.bankName.trim(),
                evidenceLink: newAccount.evidenceLink.trim(),
                advice: newAccount.advice.trim(),
            };

            await accountSchema.validate(trimmedAccount);

            setAccounts([...accounts, trimmedAccount]);

            setNewAccount({
                accountNumber: "",
                accountName: "",
                bankName: "",
                evidenceLink: "",
                advice: "",
            });
        } catch (error) {
            toast.warning(error.message);
        }
    };

    // Update an existing account in the list
    // Cập nhật tài khoản hiện có trong danh sách
    const updateAccount = (index, field, value) => {
        const updatedAccounts = accounts.slice();
        updatedAccounts[index][field] = value;
        setAccounts(updatedAccounts);
    };

    // Validate and save the account details
    // Xác thực và lưu chi tiết tài khoản
    const validateAndSaveAccount = async (index) => {
        try {
            await accountSchema.validate(accounts[index]);
            const updatedAccounts = accounts.slice();
            updatedAccounts[index].isEditing = false;
            setAccounts(updatedAccounts);
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    };

    // Delete an account from the list
    // Xóa một tài khoản khỏi danh sách
    const deleteAccount = (index) => {
        setModalIndex(index);
        setShowModal(true);
    };

    // Confirm deletion of an account
    // Xác nhận xóa tài khoản
    const confirmDelete = () => {
        const updatedAccounts = accounts.slice();
        updatedAccounts.splice(modalIndex, 1);
        setAccounts(updatedAccounts);
        setShowModal(false);
        setModalIndex(null);
    };

    // Toggle the editing state of an account
    // Chuyển đổi trạng thái chỉnh sửa của tài khoản
    const toggleEdit = (index) => {
        const updatedAccounts = accounts.map((account, idx) => {
            if (idx === index) {
                return { ...account, isEditing: !account.isEditing };
            }
            return account;
        });
        setAccounts(updatedAccounts);
    };

    // Handle form submission
    // Xử lý gửi form
    const handleSubmit = async () => {
        const isEditing = accounts.some((account) => account.isEditing);

        if (isEditing) {
            toast.warning(
                "Vui lòng hoàn thành chỉnh sửa tất cả các tài khoản trước khi gửi."
            );
            return;
        }

        if (accounts.length === 0) {
            toast.warning("Không có gì để gửi đi.");
            return;
        }

        if (parseInt(userAnswer) !== num1 + num2) {
            toast.error("Vui lòng giải đúng bài toán.");
            return;
        }

        try {
            const decodedToken = jwtDecode(accessToken);
            const userId = decodedToken.id;

            // Loại bỏ trường isEditing trước khi gửi
            const payloadAccounts = accounts.map(
                ({ isEditing, ...account }) => account
            );
            const payload = { accounts: payloadAccounts, userId };

            dispatch(requestPostScam(payload))
                .then((result) => {
                    if (result.payload.EC === 0) {
                        toast.success(result.payload.EM);
                    } else {
                        toast.error(result.payload.EM);
                    }
                })
                .catch((error) => {
                    toast.error("Có lỗi xảy ra khi đăng bài.");
                });

            createMathProblem();
            setUserAnswer("");
            setAccounts([]);
        } catch (error) {
            toast.error("Có lỗi xảy ra khi trích xuất ID người dùng.");
        }
    };

    return (
        <Container>
            <div className="main-template">
                <Card className="mb-3">
                    <Card.Body>
                        <Row>
                            <Col xs={12} md={12} xl={3}>
                                <Form.Group>
                                    <Form.Label className="mt-1">
                                        Số Tài Khoản
                                    </Form.Label>
                                    <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={
                                            <Tooltip>
                                                Ngoài số Ngân Hàng, bạn có thể
                                                nhập số MoMo, ZaloPay, Điện
                                                Thoại, v.v.
                                            </Tooltip>
                                        }
                                    >
                                        <Form.Label>
                                            <i
                                                className="bi bi-info-circle-fill ms-1"
                                                style={{ color: "red" }}
                                            ></i>
                                        </Form.Label>
                                    </OverlayTrigger>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ví dụ: 1234567891011"
                                        value={newAccount.accountNumber}
                                        onChange={(e) =>
                                            updateNewAccount(
                                                "accountNumber",
                                                e.target.value
                                            )
                                        }
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={12} xl={3}>
                                <Form.Group>
                                    <Form.Label className="mt-1">
                                        Tên Chủ Tài Khoản
                                    </Form.Label>
                                    <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={
                                            <Tooltip>
                                                Ngoài tên chủ ngân hàng, bạn có
                                                thể nhập tên MoMo, ZaloPay, SĐT
                                                v.v. (không dấu)
                                            </Tooltip>
                                        }
                                    >
                                        <Form.Label>
                                            <i
                                                className="bi bi-info-circle-fill ms-1"
                                                style={{ color: "red" }}
                                            ></i>
                                        </Form.Label>
                                    </OverlayTrigger>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ví dụ: nguyen van a"
                                        value={newAccount.accountName}
                                        onChange={(e) =>
                                            updateNewAccount(
                                                "accountName",
                                                e.target.value
                                            )
                                        }
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={12} xl={3}>
                                <Form.Group>
                                    <Form.Label className="mt-1">
                                        Tên Hệ Thống Thanh Toán
                                    </Form.Label>
                                    <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={
                                            <Tooltip>
                                                Ngoài hệ thống ngân hàng, bạn có
                                                thể nhập hệ thống MoMo, ZaloPay,
                                                SHIPCODE v.v. (không dấu)
                                            </Tooltip>
                                        }
                                    >
                                        <Form.Label>
                                            <i
                                                className="bi bi-info-circle-fill ms-1"
                                                style={{ color: "red" }}
                                            ></i>
                                        </Form.Label>
                                    </OverlayTrigger>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ví dụ: techcombank"
                                        value={newAccount.bankName}
                                        onChange={(e) =>
                                            updateNewAccount(
                                                "bankName",
                                                e.target.value
                                            )
                                        }
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={12} xl={3}>
                                <Form.Group>
                                    <Form.Label className="mt-1">
                                        Link Bài Viết Minh Chứng
                                    </Form.Label>
                                    <OverlayTrigger
                                        placement="bottom"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={
                                            <Tooltip>
                                                Link bài viết tố giác hành vi
                                                lừa đảo. Để người xem biết rõ
                                                thực, hư. Tránh trường hợp vu
                                                oan gián họa cho người bán chân
                                                chính.
                                            </Tooltip>
                                        }
                                    >
                                        <Form.Label>
                                            <i
                                                className="bi bi-info-circle-fill ms-1"
                                                style={{ color: "red" }}
                                            ></i>
                                        </Form.Label>
                                    </OverlayTrigger>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ví dụ: https://www.facebook.com/groups/266140539492082/permalink/390975053745296/"
                                        value={newAccount.evidenceLink}
                                        onChange={(e) =>
                                            updateNewAccount(
                                                "evidenceLink",
                                                e.target.value
                                            )
                                        }
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="justify-content-center mt-4">
                            <Col md={12}>
                                <Form>
                                    <Form.Group controlId="textArea">
                                        <Form.Label>
                                            Lời khuyên tốt đẹp và cảnh tỉnh cho
                                            người đi sau:
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Người viết không nên, không được dùng những từ thô tục và khiếm nhã v.v."
                                            value={newAccount.advice}
                                            onChange={(e) =>
                                                updateNewAccount(
                                                    "advice",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>
                        <Row className="mt-2">
                            <Col xs={12} md={12}>
                                <Button
                                    variant="success"
                                    className="w-100"
                                    onClick={addAccount}
                                >
                                    Thêm vào danh sách gửi{" "}
                                    <i className="bi bi-plus-square-fill"></i>
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </div>
            <Row>
                <Col md={3}>
                    <Form.Group controlId="mathProblem">
                        <Form.Label>
                            Nhập đáp án để được gửi: {num1} + {num2} = ?
                        </Form.Label>
                        <Form.Control
                            type="number"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                        />
                    </Form.Group>
                    <Button
                        className="mb-3 mt-2"
                        variant="warning"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        Gửi đi danh sách
                        <i className="bi bi-send-arrow-up-fill ms-2"></i>
                    </Button>
                </Col>
                <span>
                    Mọi người nên xem xét lại thông tin trước khi gửi. Vì không
                    thể xóa, hay chỉnh sửa.
                </span>
            </Row>
            {accounts.map((account, index) => (
                <Card className="mb-3" key={index}>
                    <Card.Body>
                        <Row>
                            <Col xs={12} md={12} xl={3}>
                                <Form.Group controlId={`accountNumber${index}`}>
                                    <Form.Label>Số Tài Khoản</Form.Label>
                                    <Form.Control
                                        type="text"
                                        disabled={!account.isEditing}
                                        value={account.accountNumber}
                                        onChange={(e) =>
                                            updateAccount(
                                                index,
                                                "accountNumber",
                                                e.target.value
                                            )
                                        }
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={12} xl={3}>
                                <Form.Group controlId={`accountName${index}`}>
                                    <Form.Label>Tên Chủ Tài Khoản</Form.Label>
                                    <Form.Control
                                        disabled={!account.isEditing}
                                        type="text"
                                        value={account.accountName}
                                        onChange={(e) =>
                                            updateAccount(
                                                index,
                                                "accountName",
                                                e.target.value
                                            )
                                        }
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={12} xl={3}>
                                <Form.Group controlId={`bankName${index}`}>
                                    <Form.Label>
                                        Tên Hệ Thống Thanh Toán
                                    </Form.Label>
                                    <Form.Control
                                        disabled={!account.isEditing}
                                        type="text"
                                        value={account.bankName}
                                        onChange={(e) =>
                                            updateAccount(
                                                index,
                                                "bankName",
                                                e.target.value
                                            )
                                        }
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={12} xl={3}>
                                <Form.Group controlId={`evidenceLink${index}`}>
                                    <Form.Label>
                                        Link Bài Viết Minh Chứng
                                    </Form.Label>
                                    <Form.Control
                                        disabled={!account.isEditing}
                                        type="text"
                                        value={account.evidenceLink}
                                        onChange={(e) =>
                                            updateAccount(
                                                index,
                                                "evidenceLink",
                                                e.target.value
                                            )
                                        }
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="justify-content-center mt-4">
                            <Col md={12}>
                                <Form>
                                    <Form.Group controlId="textArea">
                                        <Form.Label>
                                            Lời khuyên tốt đẹp cho người đi sau:
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            disabled={!account.isEditing}
                                            rows={3}
                                            placeholder="Người viết không nên, không được dùng những từ thô tục và khiếm nhã v.v."
                                            value={account.advice}
                                            onChange={(e) =>
                                                updateAccount(
                                                    index,
                                                    "advice",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>

                        <Row className="mt-2">
                            <Col xs={12} md={6}>
                                <Button
                                    variant="danger"
                                    className="w-100 mt-2"
                                    onClick={() => deleteAccount(index)}
                                >
                                    Xóa
                                </Button>
                            </Col>
                            <Col xs={12} md={6}>
                                <Button
                                    variant={
                                        account.isEditing
                                            ? "success"
                                            : "warning"
                                    }
                                    className="w-100 mt-2"
                                    onClick={() => {
                                        if (account.isEditing) {
                                            validateAndSaveAccount(index).catch(
                                                (error) => {
                                                    // Error handling already done in validateAndSaveAccount
                                                    // Do not toggle edit mode here, stay in edit mode until the update is successful
                                                }
                                            );
                                        } else {
                                            // Nếu không ở trạng thái chỉnh sửa, chỉ chuyển sang trạng thái chỉnh sửa
                                            toggleEdit(index);
                                        }
                                    }}
                                >
                                    {account.isEditing ? "Cập nhật" : "Sửa"}
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            ))}

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
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default PostScam;
