const { Category, Task } = require("../models");

class CategoryService {
  static async getAll(includeTasks = false) {
    return Category.findAll({
      include: includeTasks ? [{ model: Task, as: "tasks" }] : [],
    });
  }

  static async getById(id, includeTasks = false) {
    return Category.findOne({
      where: { id },
      include: includeTasks ? [{ model: Task, as: "tasks" }] : [],
    });
  }

  static async createCategory(payload) {
    return Category.create({ name: payload.name });
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
