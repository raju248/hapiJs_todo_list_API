const Joi = require("joi");

exports.updateTaskSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional().allow(null, ""),
  status: Joi.string().valid("1", "2", "3").optional(),
  date: Joi.date().iso().optional(),
  categoryId: Joi.number().integer().optional(),
  image: Joi.any()
    .custom((file, helpers) => {
      if (!file?.hapi?.filename) {
        return helpers.error("any.invalid");
      }

      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.hapi.headers["content-type"])) {
        return helpers.error("file.invalidType");
      }

      return file;
    })
    .messages({
      "file.invalidType": "Only JPEG and PNG files are allowed!",
      "any.invalid": "Invalid file!",
    })
    .optional(),
});
