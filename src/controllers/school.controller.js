const { handleErrorResponse } = require("../utils/errorHandler.js");
const school_service = require("../services/school.service.js");

/**
 * Adds a school
 */
exports.addSchool = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    const nameExists = await school_service.doesSchoolNameExists(name);
    if (nameExists) {
      return res.status(400).json({
        status: "FAILURE",
        message: "School with this name already exists.",
      });
    }

    await school_service.saveSchool({ name, address, latitude, longitude });
    return res.status(201).json({
      status: "SUCCESS",
      message: "School Added Successfully",
    });
  } catch (error) {
    let customErrorMessage = "Failed to add school";
    handleErrorResponse(res, req.body, req.url, error, customErrorMessage);
  }
};

/**
 * Lists all schools sorted by proximity
 */
exports.listSchools = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    const schools = await school_service.getSchools();
    if (!Array.isArray(schools) || schools.length === 0) {
      return res.status(404).json({
        status: "FAILURE",
        message: "No schools found.",
      });
    }

    schools.forEach((school) => {
      school.distance = calculateDistance(
        latitude,
        longitude,
        school.latitude,
        school.longitude
      );
    });

    schools.sort((a, b) => a.distance - b.distance);

    return res.status(200).json({
      status: "SUCCESS",
      message: "Schools fetched successfully",
      schools,
    });
  } catch (error) {
    let customErrorMessage = "Failed to fetch schools";
    handleErrorResponse(res, req.query, req.url, error, customErrorMessage);
  }
};
/**
 * Helper function to calculate the distance between two sets of lat/long coordinates
 * Using Haversine formula
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};
