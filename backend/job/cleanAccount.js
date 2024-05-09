const db = require("./../models/index");

// Hàm xóa các tài khoản chưa xác thực
// Delete unverified accounts
export async function deleteUnverifiedAccounts() {
    const twentyFourHoursAgo = new Date(new Date() - 24 * 60 * 60 * 1000);
    try {
        const result = await db.User.destroy({
            where: {
                isVerified: false,
                createdAt: {
                    [db.Sequelize.Op.lt]: twentyFourHoursAgo,
                },
            },
        });
        console.log(`Deleted ${result} unverified accounts.`);
    } catch (error) {
        console.error("Error deleting unverified accounts:", error);
    }
}
