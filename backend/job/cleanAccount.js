const db = require("./../models/index.js");

// Hàm xóa các tài khoản chưa xác thực
// Delete unverified accounts
export async function deleteUnverifiedAccounts() {
    // Tính toán thời gian 24 giờ trước
    // Calculate the time 24 hours ago
    const twentyFourHoursAgo = new Date(new Date() - 24 * 60 * 60 * 1000);
    try {
        // Xóa tài khoản người dùng chưa xác thực trước 24 giờ
        // Delete unverified user accounts created before 24 hours ago
        const result = await db.User.destroy({
            where: {
                // Chỉ xóa tài khoản chưa xác thực
                // Only delete unverified accounts
                isVerified: false,
                createdAt: {
                    // Creation time less than 24 hours ago
                    // Thời gian tạo nhỏ hơn 24 giờ trước
                    [db.Sequelize.Op.lt]: twentyFourHoursAgo,
                },
            },
        });
        console.log(`Deleted ${result} unverified accounts.`);
    } catch (error) {
        console.error("Error deleting unverified accounts:", error);
    }
}
