import React from "react";
import { Container, Row, Col } from "react-bootstrap";

// Footer component for the application
// Component Footer cho ứng dụng
const Footer = () => {
    // Define start year and get current year
    // Định nghĩa năm bắt đầu và lấy năm hiện tại
    const startYear = 2024;
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-body-tertiary" style={{ minHeight: "350px" }}>
            <Container className="p-4">
                <Row>
                    <Col md={6}>
                        <h5>Thông Tin</h5>
                        <p>Email: nguyenchin0077@gmail.com</p>
                    </Col>
                    <Col md={6}>
                        <h5>Mạng Xã Hội</h5>
                        <div>
                            <a
                                href="https://www.facebook.com/nguyenchinhnon"
                                className="me-2"
                            >
                                <i className="bi bi-facebook"></i>
                            </a>
                        </div>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col className="text-center">
                        &copy; {startYear} - {currentYear} Bản quyền được bảo
                        lưu
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
