const statuses = require("../enums/statuses");
const { Category, Task } = require("../models");
const { categorySchema } = require("../validations/categoryValidation");

module.exports = [
  {
    method: "GET",
    path: "/categories",
    handler: async function (request, h) {
      try {
        let categories = await Category.findAll({
          include: request?.query?.includeTasks
            ? [{ model: Task, as: "tasks" }]
            : [],
        });

        if (categories?.length > 0) {
          return h.response(categories);
        } else {
          return h.response({ message: "No categories found" }).code(404);
        }
      } catch (err) {
        return h.response({ error: err.message }).code(404);
      }
    },
  },
  {
    method: "GET",
    path: "/categories/{id}",
    handler: async function (request, h) {
      try {
        let category = await Category.findOne({
          where: {
            id: request.params.id,
          },
          include: request?.query?.includeTasks
            ? [{ model: Task, as: "tasks" }]
            : [],
        });

        if (category) {
          return h.response(category);
        } else {
          return h.response({ message: "No category found" }).code(404);
        }
      } catch (err) {
        return h.response({ error: err.message }).code(404);
      }
    },
  },
  {
    method: "POST",
    path: "/categories",
    handler: async function (request, h) {
      try {
        let payload = request.payload;

        let category = await Category.create({
          name: payload.name,
        });

        if (category) {
          return h.response(category);
        } else {
          return h.response({ message: "Failed to create category" }).code(404);
        }
      } catch (err) {
        return h.response({ error: err.message }).code(404);
      }
    },
    options: {
      validate: {
        payload: categorySchema,
      },
    },
  },
  {
    method: "PUT",
    path: "/categories/{id}",
    handler: async function (request, h) {
      try {
        let category = await Category.findOne({
          where: {
            id: request.params.id,
          },
        });

        if (category) {
          await category.update(request.payload);
          return h.response({ message: "Category updated successfully" });
        } else {
          return h.response({ message: "Failed to update category" }).code(404);
        }
      } catch (err) {
        return h.response({ error: err.message }).code(404);
      }
    },
  },
  {
    method: "DELETE",
    path: "/categories/{id}",
    handler: async function (request, h) {
      try {
        await Category.destroy({ where: { id: request.params.id } });
        return h.response({ message: "Category deleted successfully" });
      } catch (err) {
        return h.response({ error: err.message }).code(404);
      }
    },
  },
];
