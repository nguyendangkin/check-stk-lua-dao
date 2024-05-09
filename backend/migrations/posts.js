"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Posts", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            accountNumber: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            accountName: {
                type: Sequelize.STRING,
            },
            bankName: {
                type: Sequelize.STRING,
            },

            userId: {
                type: Sequelize.INTEGER,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });

        // Thêm chỉ mục unique vào cột email trong bảng Users
        // Add a unique index to the email column in the Users table
        // Tăng hiệu năng search
        await queryInterface.addIndex("Posts", ["accountNumber"], {
            unique: true,
            name: "idx_posts_accountNumber_unique",
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Posts");
    },
};
