// swagger-gen.js
const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger.json"; // Path to the output Swagger JSON
const endpointsFiles = [
  "./routes/auth.js",
  "./routes/events.js",
  "./routes/hall.js",
  "./routes/organizer.js",
  "./routes/users.js",
];

swaggerAutogen(outputFile, endpointsFiles).then(() => {
  require("./index.js"); // Your Express app file
});
