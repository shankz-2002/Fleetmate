# FleetMate

FleetMate is a vehicle service management system that connects customers, mechanics, managers, and administrators.

## Features

* Customer, Manager, and Mechanic registration and login
* Add and manage vehicles
* Book vehicle service appointments
* Managers can view appointments and assign mechanics
* Mechanics can view assigned services and update service status
* Managers can create bills for completed services
* Role-based access for customers, mechanics, managers, and admins

## Tech Stack

* **Frontend:** React.js, TypeScript, Material UI (MUI)
* **Backend:** Node.js, Express.js, TypeScript
* **Database:** PostgreSQL, TypeORM
* **Authentication:** JWT

## Running Locally

### Backend

```bash
cd BACKEND
npm install
npm run start
```

### Frontend

```bash
cd FRONTEND
cd frontend
npm install
npm run dev
```

## Database Setup

FleetMate uses PostgreSQL as the database.

The database connection details are currently configured directly in the backend source code.

Before running the application:

1. Install PostgreSQL.
2. Create a PostgreSQL database named `fleetmate`.
3. Open the database configuration file in the backend.
4. Update the PostgreSQL username, password, host, port, and database name according to your local setup.
5. Start the backend server.

Example configuration:

```ts
{
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "YOUR_POSTGRES_PASSWORD",
  database: "fleetmate",
}
```



## Author

Ravi Shankar

GitHub: https://github.com/shankz-2002

