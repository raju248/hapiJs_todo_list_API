const statuses = require("../enums/statuses");
const { Task, Category } = require("../models");
const { taskSchema } = require("../validations/taskValidation");
const fs = require("fs");
const path = require("path");

module.exports = [
  {
    method: "GET",
    path: "/tasks",
    handler: async function (request, h) {
      try {
        const queryParams = request.query;
        const includeModels = [];

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

        const tasks = await Task.findAll({
          where: whereClause,
          include: includeModels,
        });

        if (tasks?.length > 0) {
          return h.response(tasks);
        } else {
          return h.response({ message: "No task found" });
        }
      } catch (err) {
        return h.response({ error: err.message }).code(400);
      }
    },
  },
  {
    method: "GET",
    path: "/tasks/{id}",
    handler: async function (request, h) {
      try {
        const task = await Task.findOne({
          where: {
            id: request.params.id,
            isDeleted: false,
          },
          include: request.query.includeCategoryDetails
            ? [
                {
                  model: Category,
                  as: "category",
                  attributes: { exclude: ["createdAt", "updatedAt"] },
                },
              ]
            : null,
        });

        if (task) {
          return h.response(task);
        } else {
          return h.response({ message: "Task not found" }).code(400);
        }
      } catch (err) {
        return h.response({ error: err.message }).code(404);
      }
    },
  },
  {
    method: "POST",
    path: "/tasks",
    config: {
      handler: async function (request, h) {
        try {
          let payload = request.payload;

          const validationResult = taskSchema.validate(payload, {
            abortEarly: false,
          });

          if (validationResult.error) {
            return h.response(validationResult.error.details).code(404);
          }

          if (payload) {
            let imagePath = null;

            if (payload.image) {
              const uploadsDir = path.join(__dirname, "..", "uploads");

              if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
              }

              const file = payload.image;
              const filename = `${Date.now()}_${file.hapi.filename}`;
              const filePath = path.join(uploadsDir, filename);

              const fileStream = fs.createWriteStream(filePath);
              await file.pipe(fileStream);

              imagePath = filename;
            }

            let task = await Task.create({
              title: payload.title,
              description: payload?.description,
              status: statuses.Pending,
              date: payload?.date,
              imagePath: imagePath,
            });

            if (task.id) {
              return h.response(task);
            } else {
              return h.response({ message: "Failed to create task" }).code(404);
            }
          }
        } catch (err) {
          return h.response({ error: err.message }).code(404);
        }
      },
      payload: {
        output: "stream",
        parse: true,
        allow: "multipart/form-data",
        multipart: true,
      },
    },
  },
  {
    method: "PUT",
    path: "/tasks/{id}",
    handler: async function (request, h) {
      try {
        if (request?.payload?.categoryId) {
          let category = await Category.findOne({
            where: {
              id: request.payload.categoryId,
            },
          });

          if (!category) {
            return h.response({ message: "Invalid category" }).code(404);
          }
        }

        let task = await Task.findOne({
          where: {
            id: request.params.id,
            isDeleted: false,
          },
        });

        if (task) {
          await task.update(request.payload);
          return h.response({ message: "Task updated successfully" });
        } else {
          return h.response({ message: "Task not found" }).code(404);
        }
      } catch (err) {
        return h.response({ error: err.message }).code(404);
      }
    },
  },
  {
    method: "DELETE",
    path: "/tasks/{id}",
    handler: async function (request, h) {
      try {
        let task = await Task.findOne({
          where: {
            id: request.params.id,
            isDeleted: false,
          },
        });

        if (task) {
          task.isDeleted = true;
          await task.save();
          return h.response({ messaeg: "Task deleted successfully" });
        } else {
          return h.response({ message: "Task not found" }).code(404);
        }
      } catch (err) {
        return h.response({ error: err.message }).code(404);
      }
    },
  },
  {
    method: "GET",
    path: "/uploads/{imageName}",
    handler: async function (request, h) {
      try {
        return h.file(
          path.join(__dirname, "..", "uploads", request.params.imageName)
        );
      } catch (err) {
        return h.response({ error: err.message }).code(404);
      }
    },
  },
];
