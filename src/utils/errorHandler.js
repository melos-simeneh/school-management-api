const { DEV_ENV } = require("./constants.js");
const { log_error } = require("./logger.js");

const handleErrorResponse = (
  res,
  data,
  url,
  error,
  customErrorMessage = "INTERNAL SERVER ERROR"
) => {
  const statusCode = error.response?.status;
  const resMessage = error.response?.data?.message;
  const resData = JSON.stringify({
    status_code: statusCode,
    body: error.response?.data,
  });
  const reqData = JSON.stringify(data);
  let logContent;
  if (DEV_ENV) {
    return res.status(statusCode || 500).json({
      status: "FAILURE",
      message: resMessage || customErrorMessage,
      error: resMessage || error.message,
      stack: error.stack,
    });
  }

  let message = resMessage || customErrorMessage;
  logContent = `(${statusCode}) => msg=${message} --- url=${url} --- request_data=${reqData} --- response=${resData}  \n ${error.stack}`;
  res.status(500).json({
    status: "FAILURE",
    message,
  });

  logContent && log_error(logContent);
};

module.exports = {
  handleErrorResponse,
};
