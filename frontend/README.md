# LostAndFound Frontend (Phase 1)

This frontend implements Phase 1 of the Lost & Found MERN application: authentication UI (Login & Register) with Redux and Tailwind CSS.

## Prerequisites

- Node.js 16+
- npm
- Backend server running at `http://localhost:5000` (see backend/ README)

## Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start the frontend:

```bash
npm start
```

3. Environment variables

- Create `.env.local` in the `frontend` folder (already created) with:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Features Implemented (Phase 1)

- Login and Register pages
- Redux store for authentication
- Axios instance with JWT header support
- Protected route component
- Basic navigation
- Tailwind CSS styles (utility classes)

## How to Test

1. Run backend server: `cd backend && npm run dev`
2. Run frontend server: `cd frontend && npm start`
3. Open `http://localhost:3000`
4. Register a new user and then login to test flows

If you encounter CORS or connection issues, ensure backend is running and CORS is enabled in backend/server.js.
