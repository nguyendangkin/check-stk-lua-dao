"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("UserPosts", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            postId: {
                type: Sequelize.INTEGER,
                allowNull: false,
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

        // Thêm chỉ mục unique vào cột email trong bảng UserPosts
        // Add a unique index to the email column in the UserPosts table
        // Tăng hiệu năng search
        await queryInterface.addIndex("UserPosts", ["userId", "postId"], {
            unique: true,
            name: "idx_userposts_user_id_post_id",
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("UserPosts");
    },
};
