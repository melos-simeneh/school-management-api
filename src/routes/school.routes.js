const express = require("express");
const { addSchool, listSchools } = require("../controllers/school.controller");
const {
  validateRequestBody,
  validateQueryParams,
} = require("../utils/validation");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Schools
 *   description: API for managing schools
 */

/**
 * @swagger
 * /addSchool:
 *   post:
 *     summary: Adds a new school to the system
 *     description: This endpoint allows you to add a new school to the system by providing the name, address, latitude, and longitude. It checks if the school name already exists and validates that latitude and longitude are within acceptable ranges.
 *     tags: [Schools]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the school. It must be unique and cannot be empty.
 *                 example: "Greenfield High School"
 *               address:
 *                 type: string
 *                 description: The physical address of the school. It must not be empty.
 *                 example: "123 Main St, Springfield"
 *               latitude:
 *                 type: number
 *                 description: The latitude of the school. It must be a valid number between -90 and 90.
 *                 example: 37.7749
 *               longitude:
 *                 type: number
 *                 description: The longitude of the school. It must be a valid number between -180 and 180.
 *                 example: -122.4194
 *     responses:
 *       201:
 *         description: The school was successfully added to the system.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "SUCCESS"
 *                 message:
 *                   type: string
 *                   example: "School Added Successfully"
 *       400:
 *         description: Invalid input - The school name already exists, or missing/invalid parameters in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "FAILURE"
 *                 message:
 *                   type: string
 *                   example: "School with this name already exists."
 *       500:
 *         description: Internal server error - Something went wrong on the server.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "FAILURE"
 *                 message:
 *                   type: string
 *                   example: "Failed to add school."
 */
router.post(
  "/addSchool",
  validateRequestBody(["name", "address", "latitude", "longitude"]),
  addSchool
);

/**
 * @swagger
 * /listSchools:
 *   get:
 *     summary: Retrieves a list of schools sorted by proximity to the given coordinates.
 *     description: This endpoint retrieves all schools, sorted by distance from the provided latitude and longitude. The list will include calculated distances to each school, sorted in ascending order of proximity.
 *     tags: [Schools]
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *         description: The latitude used to filter and sort the schools by proximity. Should be a number between -90 and 90.
 *         example: 37.7749
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *         description: The longitude used to filter and sort the schools by proximity. Should be a number between -180 and 180.
 *         example: -122.4194
 *     responses:
 *       200:
 *         description: A list of schools sorted by proximity to the provided coordinates.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "SUCCESS"
 *                 message:
 *                   type: string
 *                   example: "Schools fetched successfully"
 *                 schools:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Greenfield High School"
 *                       address:
 *                         type: string
 *                         example: "123 Main St, Springfield"
 *                       latitude:
 *                         type: number
 *                         example: 37.7749
 *                       longitude:
 *                         type: number
 *                         example: -122.4194
 *                       distance:
 *                         type: number
 *                         description: The calculated distance from the provided latitude and longitude.
 *                         example: 2.5
 *       400:
 *         description: Invalid query parameters - Missing or incorrect latitude/longitude values.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "FAILURE"
 *                 message:
 *                   type: string
 *                   example: "Latitude must be a number between -90 and 90."
 *       404:
 *         description: No schools found - No schools match the given coordinates.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "FAILURE"
 *                 message:
 *                   type: string
 *                   example: "No schools found."
 *       500:
 *         description: Internal server error - An unexpected error occurred on the server.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "FAILURE"
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch schools."
 */
router.get(
  "/listSchools",
  validateQueryParams(["latitude", "longitude"]),
  listSchools
);

module.exports = router;
