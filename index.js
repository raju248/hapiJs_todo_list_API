require("dotenv").config();

const Hapi = require("@hapi/hapi");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");
const Pack = require("./package");

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
  };

  await server.register([
    require("@hapi/inert"),
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  server.route(require("./routes/tasks"));
  server.route(require("./routes/categories"));

  await server.start();
  console.log("Server running on", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

init();
