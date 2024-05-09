"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        let posts = [];
        for (let i = 1; i <= 32; i++) {
            posts.push({
                accountNumber: `ACC${i.toString().padStart(6, "0")}`,
                accountName: `Account Name ${i}`,
                bankName: `Bank ${i % 10}`,
                userId: (i % 10) + 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        await queryInterface.bulkInsert("Posts", posts, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Posts", null, {});
    },
};
