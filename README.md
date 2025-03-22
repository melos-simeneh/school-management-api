# School Management API

This API provides functionality to manage schools in the system, including **adding schools** and retrieving a **list of schools** sorted by proximity to a given set of coordinates. The API documentation is available via **Swagger UI** for easy testing and usage.

## Features

- **Add School**: Add a new school to the system by providing the name, address, latitude, and longitude.
- **List Schools**: Retrieve a list of all schools sorted by their proximity to the provided latitude and longitude.

## Endpoints

### 1. Add a New School

**POST** `/api/v1/addSchool`

This endpoint allows you to add a new school to the system.

**Request Body**:

```json
{
  "name": "Greenfield High School",
  "address": "123 Main St, Springfield",
  "latitude": 37.7749,
  "longitude": -122.4194
}
```

**Request Body Parameters**:

- `name` (string): The name of the school. Must be unique and not empty.
- `address` (string): The address of the school. Cannot be empty.
- `latitude` (number): The latitude of the school. Must be a valid number between -90 and 90.
- `longitude` (number): The longitude of the school. Must be a valid number between -180 and 180.

**Responses**:

- **201 Created**: School added successfully.

    ```json
    {
      "status": "SUCCESS",
      "message": "School Added Successfully"
    }
    ```

- **400 Bad Request** : If the school name already exists, or any required parameters are missing or invalid.

    ```json
    {
      "status": "FAILURE",
      "message": "School with this name already exists."
    }
    ```

- **500 Internal Server Error**: If there's a server error.
  
    ```json
    {
      "status": "FAILURE",
      "message": "Failed to add school."
    }
    ```

### 2. List Schools Sorted by Proximity

**GET** `/api/v1/listSchools`

This endpoint retrieves a list of schools sorted by distance from the provided latitude and longitude.

**Query Parameters**:

- `latitude` (number): Latitude to filter and sort schools by proximity. Must be between -90 and 90.
- `longitude` (number): Longitude to filter and sort schools by proximity. Must be between -180 and 180.

**Responses**:

- **200 OK**: Returns a list of schools sorted by proximity.
  
  ```json
  {
    "status": "SUCCESS",
    "message": "Schools fetched successfully",
    "schools": [
        {
        "name": "Greenfield High School",
        "address": "123 Main St, Springfield",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "distance": 2.5
        },
        {
        "name": "Riverdale Academy",
        "address": "456 Oak St, Riverdale",
        "latitude": 37.7740,
        "longitude": -122.4180,
        "distance": 3.0
        }
    ]
    }
    ```

- **400 Bad Request**: If the latitude or longitude query parameters are missing or invalid.

    ```json
    {
      "status": "FAILURE",
      "message": "Latitude must be a number between -90 and 90."
    }
    ```

- **404 Not Found**: If no schools are found.

  ```json
  {
    "status": "FAILURE",
    "message": "No schools found."
  }
  ```

- **500 Internal Server Error**: If there is an unexpected error when fetching the schools.

    ```json
    {
      "status": "FAILURE",
      "message": "Failed to fetch schools."
    }
    ```

## Validation

The API validates the following:

- **For Adding Schools**:
  - The request body must include `name`, `address`, `latitude`, and `longitude`.
  - The `latitude` should be between -90 and 90, and `longitude` should be between -180 and 180.
  - The `school name` must be unique.

- **For Listing Schools**:
  - The query parameters latitude and longitude must be provided.

## Haversine Formula for Distance Calculation

The distance between the provided latitude/longitude and the school's latitude/longitude is calculated using the Haversine formula, which is an approximation of the great-circle distance between two points on the Earth's surface.

## Installation

### Prerequisites

- Docker
- Docker Compose

### Steps to Run

1. **Clone the repository**:

    ```bash
    https://github.com/melos-simeneh/school-management-api.git
    ```

2. **Navigate to the project directory**: After cloning the repo, move to the project folder:

    ```bash
    cd school-management-api
    ```

3. **Build and start the services using Docker Compose**: Build and start the `school-api-mysql-db` (MySQL) and `school-api` (Node.js API) containers with the following command:

    ```bash
    docker-compose up -d --build
    ```

    This will:

    - Build and start the **MySQL** service (`school-api-mysql-db`).
    - Build and start the **Node.js API** service (`school-api`).
    - Ensure both services are connected via the `school-api-network`.

4. **Verify the services are running**:

    - The **School API** will be available at [http://localhost:3000](http://localhost:3000).
    - The **MySQL database** will be available at `localhost:3306`.

5. **Stop the services**: To stop the services, run:

   ```bash
   docker-compose down
   ```

### API Documentation via Swagger

Once the server is running, you can access the Swagger UI to view and test the API endpoints:

1. Open your browser and go to:[http://localhost:3000/docs](http://localhost:3000/docs)

2. The Swagger UI will display all available routes and allow you to interact with the API directly from the browser.

## Thank You

Thank you for checking out this School Management API! I hope this project helps you in building and managing your own APIs. If you have any feedback, questions, or suggestions, feel free to open an issue or reach out!
