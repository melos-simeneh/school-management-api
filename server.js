const dotenv = require("dotenv");
dotenv.config();
const { NODE_ENV } = require("./src/utils/constants.js");
const dayjs = require("dayjs");

const app = require("./app");
const PORT = process.env.PORT || 3000;

const server_start_date = dayjs().format("DD-MM-YYYY h:mm:ss A");
app.listen(PORT, () => {
  console.log(
    `School Management API Server is now running in **${NODE_ENV}** mode on port **${PORT}**, started on ${server_start_date}`
  );
});
