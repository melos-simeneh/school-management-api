const mysql = require("mysql2/promise");
const { log_error } = require("../utils/logger");

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;
pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  connectionLimit: 10,
});

const getConnectionTimeout = 5000; // milliseconds

const getConnection = async () => {
  try {
    const connection = await pool.getConnection({
      timeout: getConnectionTimeout,
    });
    return connection;
  } catch (error) {
    log_error(
      "Failed to get database connection" +
        "\n\t" +
        error.stack.split("\n").join("\n\t")
    );
    throw error;
  }
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

// Test the database connection
(async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Failed to connect to the database");
    throw error;
  } finally {
    releaseConnection(connection);
  }
})();

module.exports = {
  executeQuery,
};
