# DineDirectory Project Documentation

## Project Overview
DineDirectory is a web application compoesd of a Frontend and a Backend service. It appears to be a dashboard or directory application handling user interactions and data management.

## Tech Stack

### Frontend
- **Framework:** React (Created with Create React App)
- **UI Library:** Material UI (@mui/material, @mui/icons-material)
- **Styling:** Styled Components, Emotion
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Language:** JavaScript

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database Drivers:**
  - `mongoose` (MongoDB)
  - `mysql2` (MySQL) - *Note: Both drivers are present, checking configuration is advised to see which is active or if both are used.*
- **Authentication:** JWT (jsonwebtoken), bcryptjs
- **Utilities:** dotenv, cors, nodemon (dev)

## Deployment & Containerization

The project is containerized using Docker and orchestrated with Docker Compose.

### Backend Dockerfile (`Backend/Dockerfile`)
- **Base Image:** `node:18-alpine` (Lightweight Node.js image)
- **Working Directory:** `/app`
- **Steps:**
  1. Copies `package.json` and `package-lock.json` (via wildcard).
  2. Runs `npm install` to install dependencies.
  3. Copies the rest of the application code.
  4. Exposes port `5000`.
  5. **CMD:** `node src/server.js` (Starts the server).

### Frontend Dockerfile (`Frontend/Dockerfile`)
- **Multi-stage Build:**
  - **Stage 1 (Build):**
    - Base: `node:18-alpine`
    - Installs dependencies and runs `npm run build` to create static assets.
  - **Stage 2 (Serve):**
    - Base: `nginx:alpine`
    - Copies build artifacts from Stage 1 to `/usr/share/nginx/html`.
    - Exposes port `80`.
    - **CMD:** Starts Nginx.

### Docker Compose (`docker-compose.yml`)
Defines the services for local development or deployment.
- **Services:**
  - **backend:**
    - Builds from `./Backend` directory.
    - Maps host port `5000` to container port `5000`.
    - Loads environment variables from `.env`.
  - **frontend:**
    - Builds from `./Frontend` directory.
    - Maps host port `80` to container port `80`.

## How to Run

1. Ensure Docker and Docker Compose are installed.
2. Navigate to the project root.
3. Run:
   ```bash
   docker-compose up --build
   ```
4. Access the application:
   - Frontend: `http://localhost:80` (or just `http://localhost`)
   - Backend API: `http://localhost:5000`
