const fs = require("fs");
const path = require("path");
const { Task, Category } = require("../models");
const statuses = require("../enums/statuses");

class TaskService {
  static async getAllTasks(queryParams) {
    const includeModels = [];
    console.log(queryParams);

    let whereClause = {
      isDeleted: false,
    };

    if (queryParams.date) {
      whereClause.date = queryParams.date;
    }

    if (queryParams.status) {
      whereClause.status = queryParams.status;
    }

    if (queryParams.categoryId) {
      whereClause.categoryId = queryParams.categoryId;
    }

    if (queryParams.includeCategoryDetails) {
      includeModels.push({
        model: Category,
        as: "category",
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
    }

    let tasks = await Task.findAll({
      where: whereClause,
      include: includeModels,
    });

    return tasks;
  }

  static async getTaskById(id, includeCategory) {
    return Task.findOne({
      where: { id, isDeleted: false },
      include: includeCategory
        ? [
            {
              model: Category,
              as: "category",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ]
        : null,
    });
  }

  static async createTask(payload) {
    let imagePath = null;

    if (payload.image) {
      const uploadsDir = path.join(__dirname, "..", "uploads");
      if (!fs.existsSync(uploadsDir))
        fs.mkdirSync(uploadsDir, { recursive: true });

      const file = payload.image;
      const filename = `${Date.now()}_${file.hapi.filename}`;
      const filePath = path.join(uploadsDir, filename);

      const fileStream = fs.createWriteStream(filePath);
      await file.pipe(fileStream);

      imagePath = filename;
    }

    return Task.create({
      title: payload.title,
      description: payload.description,
      status: statuses.Pending,
      date: payload.date,
      imagePath,
    });
  }

  static async updateTask(id, payload) {
    if (payload.categoryId) {
      const category = await Category.findOne({
        where: { id: payload.categoryId },
      });
      if (!category) throw new Error("Invalid category");
    }

    const task = await Task.findOne({ where: { id, isDeleted: false } });
    if (!task) return null;

    if (payload.image) {
      const uploadsDir = path.join(__dirname, "..", "uploads");
      if (!fs.existsSync(uploadsDir))
        fs.mkdirSync(uploadsDir, { recursive: true });

      const file = payload.image;
      const filename = `${Date.now()}_${file.hapi.filename}`;
      const filePath = path.join(uploadsDir, filename);

      const fileStream = fs.createWriteStream(filePath);
      await file.pipe(fileStream);

      payload.imagePath = filename;
    }

    await task.update(payload);
    return task;
  }

  static async deleteTask(id) {
    const task = await Task.findOne({ where: { id, isDeleted: false } });
    if (!task) return null;

    task.isDeleted = true;
    await task.save();
    return task;
  }

  static async getImage(imageName) {
    return path.join(__dirname, "..", "uploads", imageName);
  }
}

module.exports = TaskService;
