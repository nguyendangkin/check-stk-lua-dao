"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Role.belongsTo(models.Group, {
                foreignKey: "groupId",
            });
        }
    }
    Role.init(
        {
            roleName: DataTypes.STRING,
            permission: DataTypes.ARRAY(DataTypes.STRING),
            description: DataTypes.STRING,
            groupId: {
                type: DataTypes.INTEGER,
            },
        },
        {
            sequelize,
            modelName: "Role",
        }
    );
    return Role;
};
