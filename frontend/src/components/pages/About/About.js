import Accordion from "react-bootstrap/Accordion";

function About() {
    return (
        <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
                <Accordion.Header>1. Cách sử dụng:</Accordion.Header>
                <Accordion.Body>
                    <ul>
                        <li>
                            Cơ chế lọc lừa đảo được là nhờ danh sách thông tin
                            kẻ lừa đảo mà người dùng tải lên, gồm các thông tin
                            định dạng không đổi: Dãy "Số Tài Khoản" đi cùng "Họ
                            Và Tên".
                        </li>
                        {"___"}
                        <li>
                            Bạn có thể kiểm tra độ uy tín bằng cách nhập dãy "Số
                            Tài Khoản" hoặc "Họ Và Tên" chủ khoản để kiểm tra,
                            suy xét. Chủ yếu là ngân hàng (có thể có Momo,
                            ZaloPay, Số Điện Thoại,... Tùy vào quy mô người dùng
                            tải lên).
                        </li>
                        {"___"}
                        <li>
                            Bạn có thể tự tải lên danh sách kẻ lừa đảo sau khi
                            đăng ký và đăng nhập.
                        </li>
                        {"___"}
                        <li>
                            Nội dung thông tin tải lên gồm có: Số (STK, ...) -
                            Họ Và Tên (NGUYEN VAN A) - Hệ Thống (MBBank,
                            VietComBank, Mono, ...) - Link Chứng Minh (bạn lấy
                            liên kết (link) của bài tố cáo. Chẳng hạn FB: Nhấn
                            Chia Sẽ -{">"} Sao Chép Liên Kết) - Lời Khuyên (một
                            số lời nhắn nhủ).
                        </li>
                    </ul>
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
                <Accordion.Header>2. Lưu ý quan trọng:</Accordion.Header>
                <Accordion.Body>
                    <ul>
                        <li>
                            Bạn phải là người tự tay vào Wed và điền thông tin
                            để kiểm tra toàn bộ. Không nên để người bán kiểm tra
                            và gửi ảnh sang. Hoặc họ gửi liên kết để nhấn vào.
                            Vì mọi thứ có thể giả và sửa đổi ở họ.
                        </li>
                        {"___"}
                        <li>
                            Nếu tra không có, có thể chưa bị đưa lên hoặc chưa
                            bị phát hiện. Kiểm tra từ Wed sẽ né được phần lớn
                            xác xuất dính lừa đảo. Nhưng hãy tỉnh táo, hoài nghi
                            và điều tra nếu thấy không có.
                        </li>
                        {"___"}
                        <li>
                            Phần "Link Chứng Minh" là nơi bạn có thể đi đến để
                            xét, soi thực hư câu chuyện của tài khoản này. Để
                            loại trừ trường hợp cố ý làm xấu người bán chân
                            chính.
                        </li>
                    </ul>
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
                <Accordion.Header>3. Nội quy chính:</Accordion.Header>
                <Accordion.Body>
                    <ul>
                        <li>
                            Hành vi "Spam" sẽ bị "cấm tài khoản", tài khoản sẽ
                            không dùng được chức năng tải lên những bài viết.
                            Nếu tình cờ phát hiện, bạn có báo cáo (qua email
                            hoặc FB) "email" và hình ảnh của tài khoản spam để
                            quản trị viên sẽ làm việc.
                        </li>
                    </ul>
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
                <Accordion.Header>4. Thêm:</Accordion.Header>
                <Accordion.Body>
                    <ul>
                        <li>
                            Ứng dụng Wed còn sơ khai. Nếu bạn phát hiện lỗi hãy
                            báo cáo ngay cho quản trị viên theo các địa chỉ liên
                            hệ ở chân trang. Trân trọng.
                        </li>
                    </ul>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

export default About;
