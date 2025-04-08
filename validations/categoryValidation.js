const Joi = require("joi");

exports.categorySchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(255)
    .required()
    .description("The name of the category"),
});

exports.categoryIdParam = Joi.object({
  id: Joi.number().integer().required().description("The ID of the category"),
});

exports.categoryUpdateSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(255)
    .required()
    .description("The name of the category"),
});

exports.includeTasksQuery = Joi.object({
  includeTasks: Joi.boolean().optional().description("Include related tasks"),
});
