"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Insert Groups
        await queryInterface.bulkInsert(
            "Groups",
            [
                {
                    id: 1,
                    groupName: "admin",
                    description: "Administrators",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    groupName: "user",
                    description: "Regular users",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 3,
                    groupName: "banned",
                    description: "Banned users",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );

        // Insert Roles
        await queryInterface.bulkInsert(
            "Roles",
            [
                {
                    id: 1,
                    roleName: "admin",
                    permission: ["c", "r", "u", "d"],
                    description: "Full access",
                    groupId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    roleName: "user",
                    permission: ["c", "r"],
                    description: "Limited access",
                    groupId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 3,
                    roleName: "banned",
                    permission: ["r"],
                    description: "Read-only access",
                    groupId: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );

        // Insert Users
        const users = [];
        const hashedPassword = await bcrypt.hash("password123", 10);

        // Admin user
        users.push({
            email: "admin@example.com",
            fullName: "Admin User",
            password: hashedPassword,
            isVerified: true,
            isBanned: false,
            groupId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // 2 banned users
        for (let i = 1; i <= 2; i++) {
            users.push({
                email: `banned${i}@example.com`,
                fullName: `Banned User ${i}`,
                password: hashedPassword,
                isVerified: true,
                isBanned: true,
                groupId: 3,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        // 14 regular users
        for (let i = 1; i <= 14; i++) {
            users.push({
                email: `user${i}@example.com`,
                fullName: `Regular User ${i}`,
                password: hashedPassword,
                isVerified: true,
                isBanned: false,
                groupId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        await queryInterface.bulkInsert("Users", users, {});

        // Insert sample Posts
        const posts = [];
        for (let i = 1; i <= 10; i++) {
            posts.push({
                accountNumber: `ACC${100000 + i}`,
                accountName: `Account ${i}`,
                bankName: `Bank ${i}`,
                userId: Math.floor(Math.random() * 14) + 4, // Assign to random regular user
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
        await queryInterface.bulkInsert("Posts", posts, {});

        // Insert sample UserPosts
        const userPosts = [];
        for (let i = 1; i <= 20; i++) {
            userPosts.push({
                userId: Math.floor(Math.random() * 17) + 1, // Random user
                postId: Math.floor(Math.random() * 10) + 1, // Random post
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
        await queryInterface.bulkInsert("UserPosts", userPosts, {});

        // Insert sample DepenPosts
        const depenPosts = [];
        for (let i = 1; i <= 5; i++) {
            depenPosts.push({
                evidenceLink: `https://example.com/evidence${i}`,
                advice: `Advice for post ${i}`,
                userId: Math.floor(Math.random() * 14) + 4, // Assign to random regular user
                postId: i,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
        await queryInterface.bulkInsert("DepenPosts", depenPosts, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("DepenPosts", null, {});
        await queryInterface.bulkDelete("UserPosts", null, {});
        await queryInterface.bulkDelete("Posts", null, {});
        await queryInterface.bulkDelete("Users", null, {});
        await queryInterface.bulkDelete("Roles", null, {});
        await queryInterface.bulkDelete("Groups", null, {});
    },
};
