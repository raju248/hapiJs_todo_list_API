const Joi = require("joi");

exports.updateTaskSchema = Joi.object({
  title: Joi.string().required().description("Title of the task"),
  description: Joi.string().optional().description("Description of the task"),
  status: Joi.string()
    .valid("1", "2", "3")
    .optional()
    .description("Status of the task"),
  date: Joi.date().iso().optional().description("Date for the task"),
  categoryId: Joi.number()
    .integer()
    .optional()
    .description("Category of the task"),
  image: Joi.any()
    .meta({ swaggerType: "file" })
    .optional()
    .description("Image file"),
});
