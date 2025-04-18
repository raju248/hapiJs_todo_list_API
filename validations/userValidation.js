const Joi = require("joi");
const userRoles = require("../enums/userRoles");

let emailSchema = Joi.string().required().description("User email");
let passwordSchema = Joi.string().required().description("Password");
let firstNameSchema = Joi.string().required().description("First name");
let lastNameSchema = Joi.string().required().description("Second name");
let roleSchema = Joi.string()
  .valid(...Object.values(userRoles))
  .required()
  .description("User role");

exports.userLoginSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
});

exports.userRegisterSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  role: roleSchema,
});
