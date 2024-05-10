"use strict";
const { faker } = require("@faker-js/faker"); // Import faker for generating fake data
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing

module.exports = {
    async up(queryInterface, Sequelize) {
        // Array to hold the user data
        const users = [];
        // Generate 33 fake users
        for (let i = 0; i < 3; i++) {
            // Generate fake data for each user
            const user = {
                email: faker.internet.email(), // Fake email
                fullName: faker.name.findName(), // Fake full name
                password: await bcrypt.hash("password", 10), // Hash the password 'password'
                codeVery: faker.datatype.uuid(), // Fake verification code
                isVerified: faker.datatype.boolean(), // Fake verification status
                groupId: faker.datatype.number({ min: 1, max: 5 }), // Fake group ID between 1 and 5
                codeCreatedAt: faker.date.past(), // Fake date for code creation
                createdAt: new Date(), // Current date for createdAt
                updatedAt: new Date(), // Current date for updatedAt
            };
            // Add user to the array
            users.push(user);
        }
        // Bulk insert the users into the Users table
        await queryInterface.bulkInsert("Users", users, {});
    },

    async down(queryInterface, Sequelize) {
        // Delete all data from Users table
        await queryInterface.bulkDelete("Users", null, {});
    },
};
