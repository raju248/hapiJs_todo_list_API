require("dotenv").config();
const Hapi = require("@hapi/hapi");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");
const Pack = require("./package");
const Jwt = require("@hapi/jwt");
const Inert = require("@hapi/inert");

const init = async () => {
  const port = process.env.PORT || 3000;

  const server = Hapi.server({
    port: port,
    host: "localhost",
  });

  const swaggerOptions = {
    info: {
      title: "Todo List API Documentation",
      version: Pack.version,
    },
    securityDefinitions: {
      jwt: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
        description: "Here enter jwt token",
      },
    },
    security: [{ jwt: [] }],
  };

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
    Jwt,
  ]);

  server.auth.strategy("my_jwt_strategy", "jwt", {
    keys: process.env.JWT_SECRET,
    verify: { aud: false, iss: false, sub: false, exp: true },
    validate: (artifacts) => {
      return {
        isValid: true,
        credentials: artifacts.decoded.payload,
      };
    },
  });

  server.auth.default("my_jwt_strategy");

  server.route([
    ...require("./routes/tasks"),
    ...require("./routes/categories"),
    ...require("./routes/users"),
  ]);

  await server.start();
  console.log("Server running on", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

init();
