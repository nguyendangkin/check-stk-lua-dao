"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.belongsTo(models.Group, {
                foreignKey: "groupId",
            });

            User.belongsToMany(models.Post, {
                through: "UserPost",
                foreignKey: "userId",
            });

            User.hasMany(models.DepenPost, {
                foreignKey: "userId",
            });
        }
    }
    User.init(
        {
            email: DataTypes.STRING,
            fullName: DataTypes.STRING,
            password: DataTypes.STRING,
            codeVery: DataTypes.STRING,
            codeCreatedAt: DataTypes.DATE,
            isVerified: DataTypes.BOOLEAN,
            groupId: {
                type: DataTypes.INTEGER,
                defaultValue: 2,
            },
        },
        {
            sequelize,
            modelName: "User",
            hooks: {
                beforeCreate: (user) => {
                    if (!user.codeCreatedAt) {
                        user.codeCreatedAt = new Date();
                    }
                },
            },
        }
    );
    return User;
};
