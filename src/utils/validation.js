const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim() !== "";

const isValidNumberInRange = (value, min, max) =>
  !isNaN(value) && value >= min && value <= max;

/**
 * Middleware to validate required query parameters
 */
exports.validateQueryParams = (requiredParams) => (req, res, next) => {
  const { query } = req;
  const missingParams = requiredParams.filter((param) => !(param in query));

  if (missingParams.length > 0) {
    return res.status(400).json({
      status: "FAILURE",
      message: `Missing required query parameters: [${missingParams.join(
        ", "
      )}]`,
    });
  }

  const { latitude, longitude } = query;

  if (latitude && !isValidNumberInRange(latitude, -90, 90)) {
    return res.status(400).json({
      status: "FAILURE",
      message: "Latitude must be a number between -90 and 90",
    });
  }

  if (longitude && !isValidNumberInRange(longitude, -180, 180)) {
    return res.status(400).json({
      status: "FAILURE",
      message: "Longitude must be a number between -180 and 180",
    });
  }

  next();
};

/**
 * Middleware to validate required body parameters
 */
exports.validateRequestBody = (requiredBodyParams) => (req, res, next) => {
  const { body } = req;

  const missingParams = requiredBodyParams.filter((param) => !(param in body));
  if (missingParams.length > 0) {
    return res.status(400).json({
      status: "FAILURE",
      message: `Missing required body parameters: [${missingParams.join(
        ", "
      )}]`,
    });
  }

  if (!isNonEmptyString(body.name)) {
    return res.status(400).json({
      status: "FAILURE",
      message: "School name cannot be empty",
    });
  }

  if (!isNonEmptyString(body.address)) {
    return res.status(400).json({
      status: "FAILURE",
      message: "School address cannot be empty",
    });
  }

  if (!isValidNumberInRange(body.latitude, -90, 90)) {
    return res.status(400).json({
      status: "FAILURE",
      message: "Latitude must be a number between -90 and 90",
    });
  }

  if (!isValidNumberInRange(body.longitude, -180, 180)) {
    return res.status(400).json({
      status: "FAILURE",
      message: "Longitude must be a number between -180 and 180",
    });
  }

  next();
};
