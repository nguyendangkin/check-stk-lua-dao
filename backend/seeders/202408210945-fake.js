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
                    description: "Quản trị viên",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    groupName: "user",
                    description: "Người dùng phổ thông",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 3,
                    groupName: "banner",
                    description: "Người dùng bị BAN tài khoản",
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
                    description: "Có đầy đủ 4 quyền",
                    groupId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    roleName: "user",
                    permission: ["c", "r"],
                    description: "Giới hạn quyền, chỉ có 2 quyền cơ bản",
                    groupId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 3,
                    roleName: "banner",
                    permission: ["r"],
                    description: "Chỉ có quyền đọc",
                    groupId: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );

        // Insert Users
        const users = [];
        const hashedPassword = await bcrypt.hash("matkhau123", 10);

        // Admin user
        users.push({
            email: "admin@gmail.com",
            fullName: "NGUYỄN NHẬT ANH",
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
                email: `banned${i}@gmail.com`,
                fullName: `TRẦN TUẤN TÚ ${i}`,
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
                email: `user${i}@gmail.com`,
                fullName: `HUỲNH LỆ DIỆU ÁI ${i}`,
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
        const usedUserIds = new Set();
        for (let i = 1; i <= 10; i++) {
            let userId;
            do {
                userId = Math.floor(Math.random() * 14) + 4;
            } while (usedUserIds.has(userId)); // Ensure unique userId
            usedUserIds.add(userId);

            posts.push({
                accountNumber: `${7950323 + i}`,
                accountName: `MAI LAN MƠ ${i}`,
                bankName: `VIETCOMBANK ${i}`,
                userId: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
        await queryInterface.bulkInsert("Posts", posts, {});

        // Insert sample UserPosts
        const userPosts = [];
        const usedUserPostPairs = new Set();
        for (let i = 1; i <= 20; i++) {
            let userId, postId, userPostPair;
            do {
                userId = Math.floor(Math.random() * 17) + 1; // Random user
                postId = Math.floor(Math.random() * 10) + 1; // Random post
                userPostPair = `${userId}-${postId}`;
            } while (usedUserPostPairs.has(userPostPair)); // Ensure unique user-post pair
            usedUserPostPairs.add(userPostPair);

            userPosts.push({
                userId: userId,
                postId: postId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
        await queryInterface.bulkInsert("UserPosts", userPosts, {});

        // Insert sample DepenPosts
        const depenPosts = [];
        const usedDepenPostPairs = new Set();
        for (let i = 1; i <= 5; i++) {
            let userId, postId, depenPostPair;
            do {
                userId = Math.floor(Math.random() * 14) + 4;
                postId = i;
                depenPostPair = `${userId}-${postId}`;
            } while (usedDepenPostPairs.has(depenPostPair)); // Ensure unique user-post pair for DepenPosts
            usedDepenPostPairs.add(depenPostPair);

            depenPosts.push({
                evidenceLink: `https://www.facebook.com/permalink.php?story_fbid=pfbid02mq3oFBgFGpeRGYXfCfh8QtJH2A75jeHoJvyHMN5WmvEzhQm6uSmkw2sEh2NGtDZgl&id=100084644706267${i}`,
                advice: `Người này hay bảo cọc tiền rồi bùng đi đâu mất! Mọi người nên cẩn thận ${i}`,
                userId: userId,
                postId: postId,
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
