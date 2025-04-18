const UserService = require("../services/userService");
const bcrypt = require("bcrypt");
const {
  userLoginSchema,
  userRegisterSchema,
} = require("../validations/userValidation");
const jwt = require("jsonwebtoken");

module.exports = [
  {
    method: "POST",
    path: "/user/login",
    handler: async function (request, h) {
      try {
        const { email, password } = request.payload;
        const user = await UserService.getUserByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
          return h.response({ error: "Invalid credentials" }).code(401);
        }

        const token = jwt.sign(
          { id: user.id, role: user.role, scope: [user.role] },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        return h.response({ token });
      } catch (err) {
        return h.response({ error: err.message }).code(501);
      }
    },
    options: {
      tags: ["api"],
      description: "Login",
      notes: "Returns a jwt token",
      validate: {
        payload: userLoginSchema,
      },
      auth: false,
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
        },
      },
    },
  },
  {
    method: "POST",
    path: "/user/register",
    handler: async function (request, h) {
      try {
        const existingUser = await UserService.getUserByEmail(
          request.payload.email
        );

        if (existingUser) {
          return h
            .response({
              error: "An user with the provided email already exists",
            })
            .code(200);
        }

        const user = await UserService.addUser(request.payload);

        if (user?.id > 0) {
          return h.response({ message: "User created successfully" }).code(201);
        } else {
          return h.response({ error: "Failed to create user" }).code(404);
        }
      } catch (err) {
        return h.response({ error: err.message }).code(501);
      }
    },
    options: {
      tags: ["api"],
      description: "Register user",
      notes: "Register user",
      auth: false,
      validate: {
        payload: userRegisterSchema,
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
        },
      },
    },
  },
];
