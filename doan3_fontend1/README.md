# Frontend

This is the Next.js frontend for the movie booking application. It runs on port
3001 so the backend can use port 3000, which is the API address used by the app.

## Run locally

Install dependencies, then start the frontend:

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001). Start the backend separately
from the `Doan_3_backend` folder; the frontend expects its API at
`http://localhost:3000`.

For a production build, run `npm run build` and then `npm start`.
