const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "School Management API",
      version: "1.0.0",
      description: "API to add and retrieve schools.",
    },
  },
  apis: ["./src/routes/school.routes.js"],
};

/**
 * This function initializes Swagger and returns the setup for Swagger UI.
 */
const setupSwagger = () => {
  const swaggerDocs = swaggerJsdoc(swaggerOptions);
  return [swaggerUi.serve, swaggerUi.setup(swaggerDocs)];
};

module.exports = {
  setupSwagger,
};
