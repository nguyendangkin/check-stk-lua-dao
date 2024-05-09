"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Users", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            fullName: {
                type: Sequelize.STRING,
            },
            password: {
                type: Sequelize.STRING,
            },
            codeVery: {
                type: Sequelize.STRING,
            },
            isVerified: {
                type: Sequelize.BOOLEAN,
            },
            groupId: {
                type: Sequelize.INTEGER,
            },
            codeCreatedAt: {
                allowNull: true,
                type: Sequelize.DATE,
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

        await queryInterface.addIndex("Users", ["email"], {
            unique: true,
            name: "idx_users_email_unique",
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Users");
    },
};
