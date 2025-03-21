const express = require("express");

const { addSchool, listSchools } = require("../controllers/school.controller");
const {
  validateRequestBody,
  validateQueryParams,
} = require("../utils/validation");

const router = express.Router();
router.post(
  "/addSchool",
  validateRequestBody(["name", "address", "latitude", "longitude"]),
  addSchool
);
router.get(
  "/listSchools",
  validateQueryParams(["latitude", "longitude"]),
  listSchools
);

module.exports = router;
