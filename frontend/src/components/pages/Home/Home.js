import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Col, Row, Card } from "react-bootstrap";
import {
    requestGetComment,
    requestGetFilteredPosts,
    requestGetPost,
} from "../../../redux/requestApi/postsApiThunk";
import { useDebounce } from "../../../HooksCustomer/debounce";
import Accordion from "react-bootstrap/Accordion";
import ReactPaginate from "react-paginate";
import classNames from "classnames/bind";
import styles from "./Home.module.scss";

const cx = classNames.bind(styles);

// Home component for displaying and managing posts
// Component Home để hiển thị và quản lý các bài đăng
const Home = () => {
    const dispatch = useDispatch();

    // Get search results and post details from Redux store
    // Lấy kết quả tìm kiếm và chi tiết bài đăng từ Redux store
    const searchResults = useSelector((state) => state.posts?.searchResults);
    const totalPosts = useSelector((state) => state.posts.totalPosts);
    const postInfo = useSelector((state) => state.posts?.postInfo);
    const depenPosts = useSelector((state) => state.posts?.depenPosts);
    const totalDepenPosts = useSelector(
        (state) => state.posts?.totalDepenPosts
    );

    // State variables for managing UI and data
    // Biến state để quản lý UI và dữ liệu
    const [searchKeyword, setSearchKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [depenPostsPage, setDepenPostsPage] = useState(0);
    const detailRef = useRef(null);
    const lastDepenPostRef = useRef(null);
    const [accountNumber, setAccountNumber] = useState(null);

    // Debounce the search keyword to reduce API calls
    // Debounce từ khóa tìm kiếm để giảm số lần gọi API
    const debouncedSearchKeyword = useDebounce(searchKeyword, 500);
    const itemsPerPage = 5;

    // Use Intersection Observer to watch the last element and load more data
    // Sử dụng Intersection Observer để quan sát phần tử cuối cùng và tải thêm dữ liệu
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const lastEntry = entries[0];
                if (
                    lastEntry.isIntersecting &&
                    depenPosts.length < totalDepenPosts
                ) {
                    setDepenPostsPage((prevPage) => prevPage + 1);
                }
            },
            { rootMargin: "100px" }
        );

        if (lastDepenPostRef.current) {
            observer.observe(lastDepenPostRef.current);
        }

        return () => observer.disconnect();
    }, [depenPosts, totalDepenPosts]);

    // API call to get comments based on the page number
    // Gọi API để lấy comment dựa trên số trang
    useEffect(() => {
        if (
            depenPostsPage > 0 &&
            accountNumber &&
            depenPosts.length < totalDepenPosts
        ) {
            dispatch(
                requestGetComment({
                    accountNumber,
                    page: depenPostsPage,
                    limit: itemsPerPage,
                })
            );
        }
    }, [depenPostsPage, dispatch, accountNumber, totalDepenPosts]);

    // Filter posts based on the debounced search keyword
    // Lọc bài đăng dựa trên từ khoá tìm kiếm đã được debounced
    useEffect(() => {
        dispatch(
            requestGetFilteredPosts({
                searchKeyword: debouncedSearchKeyword,
                limit: itemsPerPage,
                offset: currentPage * itemsPerPage,
            })
        );
    }, [debouncedSearchKeyword, currentPage, dispatch]);

    // Scroll event to show/hide the scroll to top button
    // Sự kiện cuộn trang để hiển thị/ẩn nút cuộn lên đầu trang
    useEffect(() => {
        const handleScroll = () => {
            if (window.pageYOffset > 500) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Cleanup when the component unmounts
        // Dọn dẹp khi component được gỡ bỏ
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Function to update account number and fetch data
    // Hàm để cập nhật số tài khoản và lấy dữ liệu
    const handleCheck = (number) => {
        setAccountNumber(number);
        dispatch(requestGetPost({ accountNumber: number }));
        dispatch(requestGetComment({ accountNumber: number }));
        setTimeout(() => {
            if (detailRef.current) {
                detailRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }, 100);
    };

    // Normalize input string for consistent searching
    // Chuẩn hóa chuỗi đầu vào để tìm kiếm nhất quán
    const normalizeString = (input) => {
        return input
            .normalize("NFD") // Chuẩn hóa chuỗi về dạng phân tách
            .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu
            .toUpperCase(); // Chuyển đổi sang chữ hoa
    };

    // Handle page selection from pagination
    // Xử lý việc chọn trang từ phân trang
    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    // Handle changes in the search input field
    // Xử lý các thay đổi trong trường nhập tìm kiếm
    const handleSearchChange = (e) => {
        const normalizedValue = normalizeString(e.target.value);
        setSearchKeyword(normalizedValue); // Cập nhật trạng thái bằng chuỗi đã được chuẩn hóa và chuyển hoa
        setCurrentPage(0); // Reset về trang đầu tiên với t page with new search
    };

    // Scroll to the top of the page
    // Cuộn lên đầu trang
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <Row>
            <Col xs={12} md={12}>
                <Card body className="mt-2">
                    <Form className="d-flex mb-2">
                        <Form.Control
                            type="search"
                            placeholder="HO VA TEN hoặc dãy STK ngân hàng"
                            aria-label="Search"
                            value={searchKeyword}
                            onChange={handleSearchChange}
                        />
                    </Form>
                    {searchResults?.map((post, index) => (
                        <Card key={`item-account-${index}`} className="mb-2">
                            <Card.Body className={cx("cardBodyFlex")}>
                                <div className={cx("card-group-text")}>
                                    <Card.Title>
                                        {post.accountNumber}
                                    </Card.Title>
                                    <Card.Text className="p-1">
                                        {post.accountName}
                                    </Card.Text>
                                </div>
                                <div className={cx("cardText")}>
                                    <Card.Text className="mb-0 p-1 d-flex align-items-center">
                                        {post.bankName}
                                    </Card.Text>
                                </div>
                                <Button
                                    variant="outline-success"
                                    className="mt-1"
                                    onClick={() =>
                                        handleCheck(post.accountNumber)
                                    }
                                >
                                    Check
                                </Button>
                            </Card.Body>
                        </Card>
                    ))}
                    <div className="mt-2 d-flex justify-content-center">
                        <ReactPaginate
                            nextLabel=">"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={3}
                            marginPagesDisplayed={2}
                            pageCount={Math.ceil(totalPosts / itemsPerPage)}
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
                    </div>
                </Card>
            </Col>
            <Col xs={12} md={12}>
                {postInfo && (
                    <Card ref={detailRef} body className="mt-2">
                        <div className="text-center mb-3">
                            <Card.Title>{postInfo.accountNumber}</Card.Title>
                            <Card.Subtitle>
                                {postInfo.accountName}
                            </Card.Subtitle>
                            <Card.Text>{postInfo.bankName}</Card.Text>
                        </div>
                        {depenPosts?.map((depenPost, index) => (
                            <Card
                                body
                                className="mt-1"
                                key={`item-comment-${index}`}
                                ref={
                                    index === depenPosts.length - 1
                                        ? lastDepenPostRef
                                        : null
                                }
                            >
                                <Card.Header>{`${depenPost.userName} (${depenPost.email})`}</Card.Header>
                                <Card.Body>
                                    <Button
                                        href={depenPost.evidenceLink}
                                        variant="success"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Đi xem bằng chứng
                                    </Button>
                                    <p style={{ fontSize: "12px" }}>
                                        {depenPost.evidenceLink}
                                    </p>
                                    <p>Lời khuyên:</p>
                                    <Accordion>
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header
                                                className={cx(
                                                    "accordionHeader"
                                                )}
                                            >
                                                {depenPost.advice}
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                {depenPost.advice}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </Card.Body>
                            </Card>
                        ))}
                    </Card>
                )}
            </Col>
            {showScrollButton && (
                <Button className={cx("scrollToTopBtn")} onClick={scrollToTop}>
                    <i className="bi bi-layer-forward"></i>
                </Button>
            )}
        </Row>
    );
};

export default Home;
