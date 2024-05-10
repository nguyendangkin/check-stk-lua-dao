"use strict";
const { faker } = require("@faker-js/faker");

module.exports = {
    async up(queryInterface, Sequelize) {
        // Create an array of fake comments
        const fakeComments = [];
        for (let i = 0; i < 32; i++) {
            fakeComments.push({
                evidenceLink: faker.internet.url(),
                advice: faker.lorem.sentence(),
                userId: faker.datatype.number({ min: 1, max: 100 }), // Random userId between 1 and 100
                postId: 2, // Fixed postId
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        // Insert the fake comments into the DepenPosts table
        await queryInterface.bulkInsert("DepenPosts", fakeComments, {});
    },

    async down(queryInterface, Sequelize) {
        // Remove all the entries from the DepenPosts table
        await queryInterface.bulkDelete("DepenPosts", { postId: 2 }, {});
    },
};
