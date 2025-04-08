const {
  categorySchema,
  categoryUpdateSchema,
  categoryIdParam,
  includeTasksQuery,
} = require("../validations/categoryValidation");
const Joi = require("joi");
const CategoryService = require("../services/categoryService");

module.exports = [
  {
    method: "GET",
    path: "/categories",
    handler: async function (request, h) {
      try {
        const categories = await CategoryService.getAll(
          request.query.includeTasks
        );

        if (categories?.length > 0) {
          return h.response(categories);
        } else {
          return h.response({ message: "No categories found" }).code(404);
        }
      } catch (err) {
        return h.response({ error: err.message }).code(501);
      }
    },
    options: {
      tags: ["api"],
      description: "Get all categories",
      notes: "Returns all categories",
      validate: {
        query: includeTasksQuery,
      },
    },
  },
  {
    method: "GET",
    path: "/categories/{id}",
    handler: async function (request, h) {
      try {
        const category = await CategoryService.getById(
          request.params.id,
          request.query.includeTasks
        );

        if (category) {
          return h.response(category);
        } else {
          return h.response({ message: "No category found" }).code(404);
        }
      } catch (err) {
        return h.response({ error: err.message }).code(501);
      }
    },
    options: {
      tags: ["api"],
      description: "Get a specific category by ID",
      notes: "Returns a category by ID",
      validate: {
        params: categoryIdParam,
        query: includeTasksQuery,
      },
    },
  },
  {
    method: "POST",
    path: "/categories",
    handler: async function (request, h) {
      try {
        const category = await CategoryService.createCategory(request.payload);

        if (category) {
          return h.response(category);
        } else {
          return h.response({ message: "Failed to create category" }).code(404);
        }
      } catch (err) {
        return h.response({ error: err.message }).code(501);
      }
    },
    options: {
      validate: {
        payload: categorySchema,
      },
      tags: ["api"],
      description: "Add new category",
      notes: "Creates new category and returns the object",
    },
  },
  {
    method: "PUT",
    path: "/categories/{id}",
    handler: async function (request, h) {
      try {
        const category = await CategoryService.updateCategory(
          request.params.id,
          request.payload
        );

        if (category) {
          return h.response({ message: "Category updated successfully" });
        } else {
          return h.response({ message: "Failed to update category" }).code(404);
        }
      } catch (err) {
        return h.response({ error: err.message }).code(501);
      }
    },
    options: {
      validate: {
        payload: categoryUpdateSchema,
        params: categoryIdParam,
      },
      tags: ["api"],
      description: "Update category by Id",
      notes: "Updates category by Id",
    },
  },
  {
    method: "DELETE",
    path: "/categories/{id}",
    handler: async function (request, h) {
      try {
        await CategoryService.deleteCategory(request.params.id);
        return h.response({ message: "Category deleted successfully" });
      } catch (err) {
        return h.response({ error: err.message }).code(501);
      }
    },
    options: {
      tags: ["api"],
      description: "Delete a category by ID",
      notes: "Deletes the category with the specified ID",
      validate: {
        params: categoryIdParam,
      },
    },
  },
];
