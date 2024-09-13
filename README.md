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

## Prisma Configuration

1. Make sure you have a database configured and update the `.env` file with your database URL. Example:

   ```
   DATABASE_URL="mysql://user:password@localhost:3306/database-name"
   ```

2. Run the Prisma migration to configure the database:

   ```bash
   npx prisma db push
   ```

## Running the application

1. To start the server, run:

   ```bash
   npm run start
   ```

2. The server will be running at [http://localhost:3000](http://localhost:3000).
