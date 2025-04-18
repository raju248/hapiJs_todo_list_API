"use strict";
const { Model } = require("sequelize");
const userRoles = require("../enums/userRoles");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Category, {
        foreignKey: "userId",
        as: "category",
        onDelete: "CASCADE",
      });

      User.hasMany(models.Task, {
        foreignKey: "userId",
        as: "Tasks",
        onDelete: "CASCADE",
      });
    }
  }
  User.init(
    {
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      role: {
        type: DataTypes.ENUM(userRoles.admin, userRoles.member),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
