const dotenv = require("dotenv");
dotenv.config();
const { DEV_ENV, NODE_ENV } = require("./src/utils/constants.js");
if (!DEV_ENV) dotenv.config({ path: "./.env.prod", override: true });
const dayjs = require("dayjs");

const app = require("./app");
const PORT = process.env.PORT || 8000;

const server_start_date = dayjs().format("DD-MM-YYYY h:mm:ss A");
app.listen(PORT, () => {
  console.log(
    `School Management API Server is now running in **${NODE_ENV}** mode on port **${PORT}**, started on ${server_start_date}`
  );
});
