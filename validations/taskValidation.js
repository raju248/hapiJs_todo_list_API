const Joi = require("joi");

exports.taskSchema = Joi.object({
  title: Joi.string().required(),
  image: Joi.any()
    .custom((file, helpers) => {
      if (!file || !file.hapi || !file.hapi.filename) {
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
