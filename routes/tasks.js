const statuses = require("../enums/statuses");
const { Task } = require("../models");
const task = require("../models/task");
const { taskSchema } = require("../validations/taskValidation");

module.exports = [
  {
    method: "GET",
    path: "/tasks",
    handler: async function (request, h) {
      try {
        const queryParams = request.query;
        let whereClause = {
          isDeleted: false,
        };

        if (queryParams.date) {
          whereClause.date = queryParams.date;
        }

        if (queryParams.status) {
          whereClause.status = queryParams.status;
        }

        const tasks = await Task.findAll({
          where: whereClause,
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
          let task = await Task.create({
            title: payload.title,
            description: payload?.description,
            status: statuses.Pending,
            date: payload?.date,
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
  },
  {
    method: "PUT",
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
];
