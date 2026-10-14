# Backend

This is the Express API for the movie booking application. It listens on port
3000 by default, matching the API URLs configured in the frontend.

## Requirements

- Node.js and npm
- MySQL with the `movie_cgv` database and the application's tables

## Run locally

From this folder, install dependencies and start the API:

```bash
npm install
npm run dev
```

The API is available at `http://localhost:3000`. Use `npm start` to start it
without the development script.

## MySQL configuration

The defaults are `localhost`, user `root`, and database `movie_cgv`. Set
`DB_HOST`, `DB_USER`, `DB_PASSWORD`, or `DB_NAME` in the environment to override
them. For example, in PowerShell:

```powershell
$env:DB_PASSWORD = "your-mysql-password"
npm run dev
```

The database and schema must exist before using API endpoints that read or write
data. The backend logs a connection error if MySQL is unavailable or the
credentials are incorrect.
