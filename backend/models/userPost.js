"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class UserPost extends Model {
        static associate(models) {
            // Define the relationships here
            UserPost.belongsTo(models.User, {
                foreignKey: "userId",
                as: "User",
            });
            UserPost.belongsTo(models.Post, {
                foreignKey: "postId",
                as: "Post",
            });
        }
    }
    UserPost.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            postId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "UserPost",
        }
    );

    return UserPost;
};
