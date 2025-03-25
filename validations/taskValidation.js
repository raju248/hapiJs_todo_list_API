const Joi = require("joi");

exports.taskSchema = Joi.object({
  title: Joi.string().required(),
});
