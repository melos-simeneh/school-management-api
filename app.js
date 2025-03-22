const express = require("express");
const morgan = require("morgan");
const schoolRoutes = require("./src/routes/school.routes.js");
const { setupSwagger } = require("./src/utils/swagger.config");
const {
  log_error,
  incomingRequests,
  outgoingResponse,
} = require("./src/utils/logger.js");
const { DEV_ENV } = require("./src/utils/constants.js");

const app = express();

//middlewares
app.use(express.json());

app.use(morgan("tiny"));

// Middleware to log incoming requests
app.use(incomingRequests);
app.use(outgoingResponse);

//welcome route
app.get("/", (req, res) => {
  res.send({ message: "Welcome to School Management API" });
});

app.use("/docs", setupSwagger());

app.use("/api/v1", schoolRoutes);

// Error handling middleware for unhandled errors
app.use((err, req, res, next) => {
  const statusCode = DEV_ENV ? err.statusCode || 500 : 200;
  const errStatusCode = err.statusCode || 500;
  const response = {
    status: "FAILURE",
    message: "Internal Server Error",
  };

  if (DEV_ENV) {
    response.error = err.message;
    response.stack = err.stack;
  }

  if (`${errStatusCode}`.startsWith("4")) {
    response.message = "Bad Request";
  }
  res.status(statusCode).json(response);

  !DEV_ENV && log_error(err.stack.split("\n").join("\n\t"));
});

//url not found middleware
app.use((req, res) => {
  res.status(404).json({
    status: "FAILURE",
    message: `The API endpoint "${req.url}" with method "${req.method}" was not found.`,
  });
});

module.exports = app;
