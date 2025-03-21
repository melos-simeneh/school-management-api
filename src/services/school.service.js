const { executeQuery } = require("../config/db");

exports.doesSchoolNameExists = async (name) => {
  name = name.trim();
  const checkQuery = "SELECT 1 FROM schools WHERE name = ? LIMIT 1";

  const [result] = await executeQuery(checkQuery, [name]);

  return result !== undefined;
};

exports.saveSchool = async (body) => {
  let { name, address, latitude, longitude } = body;
  name = name.trim();
  address = address.trim();
  const query =
    "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";

  const errorMessageForLog = `Failed to save school to schools table
  \n\t\t school_detail=${JSON.stringify(body)}\n\t\t}\n`;

  const values = [name, address, latitude, longitude];
  await executeQuery(query, values, errorMessageForLog);
};

exports.getSchools = async () => {
  const query = "SELECT * FROM schools";
  const [rows] = await executeQuery(query);
  return rows;
};
