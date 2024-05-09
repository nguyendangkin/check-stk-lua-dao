const createEmailTemplate = (code) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f9f9f9;
                    color: #333;
                }
                .container {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    max-width: 600px;
                    margin: 0 auto;
                }
                .header {
                    background-color: #007bff;
                    color: #fff;
                    padding: 10px 20px;
                    text-align: center;
                    border-radius: 5px 5px 0 0;
                }
                .content {
                    padding: 20px;
                }
                .footer {
                    text-align: center;
                    color: #888;
                    font-size: 12px;
                    padding: 10px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Mã xác thực của bạn</h2>
                </div>
                <div class="content">
                    <p>Xin chào,</p>
                    <p>Đây là mã xác thực của bạn: <strong>${code}</strong></p>
                    <p>Vui lòng sử dụng mã này để hoàn tất quá trình xác thực.</p>
                </div>
                <div class="footer">
                    <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

module.exports = createEmailTemplate;
