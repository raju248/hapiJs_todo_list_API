const userRoles = require("../enums/userRoles");
const { Category, Task } = require("../models");

class CategoryService {
  static async getAll(role, includeTasks = false, userId = 0) {
    let taskWhereClause = {};

    if (role == userRoles.member && userId > 0) {
      taskWhereClause.userId = userId;
    }

    return Category.findAll({
      include: includeTasks
        ? [
            {
              model: Task,
              where: taskWhereClause,
              as: "tasks",
              required: false,
            },
          ]
        : [],
    });
  }

  static async getById(id, role, includeTasks = false, userId = 0) {
    let taskWhereClause = {};

    if (role == userRoles.member && userId > 0) {
      taskWhereClause.userId = userId;
    }

    return Category.findOne({
      where: { id },
      include: includeTasks
        ? [
            {
              model: Task,
              where: taskWhereClause,
              as: "tasks",
              required: false,
            },
          ]
        : [],
    });
  }

  static async createCategory(payload, userId) {
    return Category.create({ name: payload.name, userId });
  }

  static async updateCategory(id, payload) {
    const category = await Category.findOne({ where: { id } });
    if (!category) return null;
    await category.update(payload);
    return category;
  }

  static async deleteCategory(id) {
    return Category.destroy({ where: { id } });
  }
}

module.exports = CategoryService;
