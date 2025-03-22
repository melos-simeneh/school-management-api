const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

const timestamp = () => dayjs().format("dddd, MMMM DD, YYYY h:mm:ss A");
const today = () => dayjs().format("DD-MM-YYYY");

const logToFile = (fileName, content) => {
  const logPath = path.join(__dirname, "../../logs");
  const logFile = path.join(logPath, fileName);

  // Create the logs directory if it doesn't exist
  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath);
  }

  fs.appendFile(logFile, content, (err) => {
    if (err) {
      console.log(err);
      return 0;
    }
  });
};
exports.log_error = (content) => {
  const logFileName = `error_log_${today()}.log`;
  const message = `\n${timestamp()} -----> ${content}\n`;
  logToFile(logFileName, message);
};

const getLogFileName = (url, type) => {
  return `school_mgt_${type}_log_${today()}.log`;
};

const swaggerUrlPattern = "/docs";
exports.incomingRequests = async (req, res, next) => {
  if (req.originalUrl.startsWith(swaggerUrlPattern)) {
    return next();
  }

  const url = req.originalUrl;
  const logEntry = {
    timestamp: timestamp(),
    method: req.method,
    url: url,
  };

  if (req.method === "POST") {
    logEntry.body = req.body;
  }

  const content = JSON.stringify(logEntry) + "\n";
  const requestLogFileName = getLogFileName(url.toString(), "request");
  logToFile(requestLogFileName, content);

  next();
};

exports.outgoingResponse = async (req, res, next) => {
  if (req.originalUrl.startsWith(swaggerUrlPattern)) {
    return next();
  }

  const startTime = Date.now();
  let isLogged = false;

  const oldSend = res.send;
  res.send = function (data) {
    if (isLogged) {
      return oldSend.call(this, data);
    }

    isLogged = true;

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    const url = req.originalUrl;
    const logEntry = {
      timestamp: timestamp(),
      duration: `${duration}s`,
      status: res.statusCode,
      url: url,
      method: req.method,
      responseBody: JSON.parse(data),
    };
    if (req.method === "POST") {
      logEntry.requestDetail = logEntry.requestDetail || {};
      logEntry.requestDetail.body = req.body;
    }
    const content = JSON.stringify(logEntry) + "\n";

    const accessLogFileName = getLogFileName(url.toString(), "access");
    logToFile(accessLogFileName, content);

    return oldSend.call(this, data);
  };

  next();
};
