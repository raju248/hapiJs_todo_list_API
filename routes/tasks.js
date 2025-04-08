const {
  taskSchema,
  categoryQuery,
  taskIdParam,
  imageNameParam,
  categoryDetailsQuery,
} = require("../validations/taskValidation");
const { updateTaskSchema } = require("../validations/updateTaskValidation");
const TaskService = require("../services/taskService");

module.exports = [
  {
    method: "GET",
    path: "/tasks",
    handler: async function (request, h) {
      try {
        const tasks = await TaskService.getAllTasks(request.query);

        if (tasks?.length > 0) {
          return h.response(tasks);
        } else {
          return h.response({ message: "No task found" }).code(404);
        }
      } catch (err) {
        return h.response({ error: err.message }).code(501);
      }
    },
    options: {
      tags: ["api"],
      description: "Get all tasks",
      notes:
        "Supports filtering by date, status, category, and including category details.",
      validate: {
        query: categoryQuery,
      },
    },
  },
  {
    method: "GET",
    path: "/tasks/{id}",
    handler: async function (request, h) {
      try {
        const task = await TaskService.getTaskById(
          request.params.id,
          request.query.includeCategoryDetails
        );

        if (task) {
          return h.response(task);
        } else {
          return h.response({ message: "Task not found" }).code(400);
        }
      } catch (err) {
        return h.response({ error: err.message }).code(501);
      }
    },
    options: {
      tags: ["api"],
      description: "Get a single task by ID",
      notes: "Returns a single task with optional category data.",
      validate: {
        params: taskIdParam,
        query: categoryDetailsQuery,
      },
    },
  },
  {
    method: "POST",
    path: "/tasks",
    handler: async function (request, h) {
      try {
        const task = await TaskService.createTask(request.payload);

        if (task.id) {
          return h.response(task);
        } else {
          return h.response({ message: "Failed to create task" }).code(404);
        }
      } catch (err) {
        return h.response({ error: err.message }).code(501);
      }
    },
    options: {
      tags: ["api"],
      description: "Create a new task",
      notes: "Accepts multipart form-data, including an optional image.",
      payload: {
        output: "stream",
        parse: true,
        allow: "multipart/form-data",
        multipart: true,
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
        },
      },
      validate: {
        payload: taskSchema,
      },
    },
  },
  {
    method: "PUT",
    path: "/tasks/{id}",
    handler: async function (request, h) {
      try {
        const task = await TaskService.updateTask(
          request.params.id,
          request.payload
        );

        if (task) {
          await task.update(request.payload);
          return h.response({ message: "Task updated successfully" });
        } else {
          return h.response({ message: "Task not found" }).code(404);
        }
      } catch (err) {
        return h.response({ error: err.message }).code(501);
      }
    },
    options: {
      tags: ["api"],
      description: "Update task",
      notes: "Accepts multipart form-data, including an optional image.",
      payload: {
        output: "stream",
        parse: true,
        allow: "multipart/form-data",
        multipart: true,
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
        },
      },
      validate: {
        payload: updateTaskSchema,
        params: taskIdParam,
      },
    },
  },
  {
    method: "DELETE",
    path: "/tasks/{id}",
    handler: async function (request, h) {
      try {
        const task = await TaskService.deleteTask(request.params.id);

        if (task) {
          return h.response({ messaeg: "Task deleted successfully" });
        } else {
          return h.response({ message: "Task not found" }).code(404);
        }
      } catch (err) {
        return h.response({ error: err.message }).code(501);
      }
    },
    options: {
      tags: ["api"],
      description: "delete a task by ID",
      validate: {
        params: taskIdParam,
      },
    },
  },
  {
    method: "GET",
    path: "/uploads/{imageName}",
    handler: async function (request, h) {
      try {
        const filePath = await TaskService.getImage(request.params.imageName);
        return h.file(filePath);
      } catch (err) {
        return h.response({ error: err.message }).code(501);
      }
    },
    options: {
      tags: ["api"],
      description: "Get image by name",
      validate: {
        params: imageNameParam,
      },
    },
  },
];
