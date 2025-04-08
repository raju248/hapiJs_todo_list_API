const Joi = require("joi");

let includeCategoryDetailsSchema = Joi.boolean()
  .optional()
  .description("Include related category details");

let dateSchema = Joi.string()
  .isoDate()
  .optional()
  .description("Date for the task");

exports.taskSchema = Joi.object({
  title: Joi.string().required().description("Title of the task"),
  description: Joi.string().optional().description("Description of the task"),
  date: dateSchema,
  image: Joi.any()
    .meta({ swaggerType: "file" })
    .optional()
    .description("Image file"),
});

exports.categoryQuery = Joi.object({
  includeCategoryDetails: includeCategoryDetailsSchema,
  date: dateSchema,
  status: Joi.string().optional().description("Filter by status"),
  categoryId: Joi.number()
    .integer()
    .optional()
    .description("Filter by category ID"),
});

exports.categoryDetailsQuery = Joi.object({
  includeCategoryDetails: includeCategoryDetailsSchema,
});

exports.taskIdParam = Joi.object({
  id: Joi.number().integer().required().description("Task ID"),
});

exports.imageNameParam = Joi.object({
  imageName: Joi.string().required().description("Image name"),
});
