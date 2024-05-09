"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class DepenPost extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            DepenPost.belongsTo(models.Post, {
                foreignKey: "postId",
            });

            DepenPost.belongsTo(models.User, {
                foreignKey: "userId",
            });
        }
    }
    DepenPost.init(
        {
            evidenceLink: DataTypes.TEXT,
            advice: DataTypes.TEXT,
            userId: DataTypes.INTEGER,
            postId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "DepenPost",
        }
    );
    return DepenPost;
};
