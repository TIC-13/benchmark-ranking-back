# Benchmarking Ranking

This project is a benchmarking ranking API developed with Node.js, Express, TypeScript, and Prisma.

## Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

## Installation

1. Clone this repository;

2. Navigate to the project directory;

3. Install the dependencies:

   ```bash
   yarn
   ```

## Environment
In the `.env` file, assign a base64-encoded 32-byte (AES-256) value to `API_KEY`. Ensure that this key is the same as the one used in the client applications.

## Prisma Configuration

1. Make sure you have a database configured and update the `.env` file with your database URL. Example:

   ```
   DATABASE_URL="mysql://user:password@localhost:3306/database-name"
   ```

2. Run the Prisma migration to configure the database:

   ```bash
   npx prisma db push
   ```

## Running in Production Using Docker

You can run this project in production using Docker.

1. **Start the MySQL database container:**

   ```bash
   docker compose up db
   ```

   You can configure the container using environment variables in the `.env` file:

   * `DOCKER_MYSQL_ROOT_PASSWORD`: Password for the root user (default: `root`)
   * `DOCKER_MYSQL_USER`: Database user (default: `user`)
   * `DOCKER_DB_VOLUME_PATH`: Path for the database volume (default: named volume `ranking_db_data`)
   * `DOCKER_DB_BACKUP_FILE_TO_CONSUME`: Path to a backup file to initialize the database with, if any. When provided, the database will start with the backup data.
   * `ENABLE_BACKUP`: If the database container should do backup in the BACKUP_PATH
   * `DOCKER_DB_BACKUP_PATH`: Path to store the backup if ENABLE_BACKUP is true (default: `./backup`)`
   * `BACKUP_INTERVAL`: Interval to do the backup (default: 86400 seconds, or one day)

2. **Start the API container:**

   ```bash
   docker compose up app
   ```

   Environment variables you can set in `.env`:

   * `DOCKER_BACK_PORT_EXPOSED`: Port on the host machine to access the API (default: `3030`)
   * `PORT`: Port where the API will run inside the container (and outside, if run without Docker) (default: `3030`)

