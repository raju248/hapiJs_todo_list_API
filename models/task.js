"use strict";
const { Model } = require("sequelize");
const { Category } = require("./category");
const statuses = require("../enums/statuses");
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Task.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
        onDelete: "SET NULL",
      });
    }
  }
  Task.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      status: {
        type: DataTypes.ENUM(
          statuses.Pending.toString(),
          statuses.InProgress.toString(),
          statuses.Completed.toString()
        ),
        allowNull: false,
        defaultValue: statuses.Pending.toString(),
      },
      date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Category,
          key: "id",
        },
      },
      imagePath: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Task",
    }
  );
  return Task;
};
