const mysql = require("mysql2/promise");
const { log_error } = require("../utils/logger");

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  connectionLimit: 10,
});

const MAX_RETRIES = 5;
const RETRY_DELAY = 1000;
const RETRY_EXPONENTIAL_BACKOFF = true;

const retry = async (fn, retries = MAX_RETRIES, delay = RETRY_DELAY) => {
  let attempt = 0;
  let lastError;

  while (attempt < retries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      attempt++;
      console.error(
        `[ERROR]: DB connection failed (Attempt ${attempt}). Retrying in ${delay}ms...`
      );

      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delay));

        if (RETRY_EXPONENTIAL_BACKOFF) {
          delay *= 2;
        }
      }
    }
  }

  throw new Error(
    `UNABLE TO ESTABLISH CONNECTION AFTER ${retries} ATTEMPTS: ${lastError.message}`
  );
};

const getConnection = async () => {
  return await retry(async () => {
    const connection = await pool.getConnection();
    return connection;
  });
};

const releaseConnection = (connection) => {
  if (connection) {
    connection.release();
  }
};

const executeQuery = async (query, params = [], errorMessage = "") => {
  let connection;
  try {
    connection = await getConnection();
    return await connection.execute(query, params);
  } catch (error) {
    log_error(errorMessage + "\t" + error.stack.split("\n").join("\n\t"));
    throw error;
  } finally {
    releaseConnection(connection);
  }
};

(async () => {
  let connection;
  try {
    connection = await getConnection();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Failed to connect to the database after multiple attempts");
    throw error;
  } finally {
    releaseConnection(connection);
  }
})();

module.exports = {
  executeQuery,
};
