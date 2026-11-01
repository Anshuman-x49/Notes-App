# Notes App

This project is a full stack notes app built with React on the frontend and Node.js, Express, and MongoDB on the backend. It supports creating, viewing, updating, deleting, and favoriting notes, with authentication required for note routes.

## Live demo

[TODO(author): What is the live demo URL?]

## Features

- Create notes with a title and description
- View all notes for the signed-in user
- Open a single note by id
- Update note title and description
- Delete notes
- Mark notes as favorites
- Search notes by title or description in the frontend
- User registration, login, logout, and token refresh

## Tech stack

### Frontend

- React
- Vite
- React Router
- Redux Toolkit
- Axios
- Tailwind CSS
- React Hook Form
- Lucide React
- @types/react
- @types/react-dom
- @vitejs/plugin-react
- oxlint

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT
- bcryptjs
- cookie-parser
- dotenv
- CORS

## API reference

| Method | Path | What it does |
| --- | --- | --- |
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Log in an existing user |
| GET | /api/auth/get-user | Get the current user |
| POST | /api/auth/refresh | Refresh the access token |
| POST | /api/auth/logout | Log out the user |
| POST | /api/notes/add-note | Create a note |
| GET | /api/notes/get-notes | Get all notes for the current user |
| GET | /api/notes/get-note/:id | Get one note by id |
| PUT | /api/notes/update-note/:id | Update one note |
| DELETE | /api/notes/delete-note/:id | Delete one note |
| PUT | /api/notes/fav-note/:id | Toggle the favorite status of a note |

### Example: create a note

```http
POST /api/notes/add-note
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Project plan",
  "description": "Draft the release checklist for next week."
}
```

```json
{
  "message": "Note created successfully",
  "data": {
    "title": "Project plan",
    "description": "Draft the release checklist for next week.",
    "user": "<user_id>",
    "isFavorite": false,
    "_id": "<note_id>",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Example: search

The frontend filters the currently loaded notes array in the browser. The search query is compared against each note title and description using a lowercase `.includes()` check.

```js
const query = "meeting";
const matches = notes.filter((note) =>
  (note.title || "").toLowerCase().includes(query.toLowerCase()) ||
  (note.description || "").toLowerCase().includes(query.toLowerCase())
);
```

## How search works

Search is client-side in `frontend/src/pages/Home.jsx`. It filters the notes already returned from the backend by checking whether the search string appears in the lowercase title or description of each note. This is not a MongoDB text index and there is no dedicated backend search route in the code.

## Running locally

### Prerequisites

- Node.js
- MongoDB instance or MongoDB Atlas connection

### Clone and install

```bash
git clone https://github.com/Anshuman-x49/Notes-App.git
cd Notes-App
cd backend && npm install
cd ../frontend && npm install
```

### Start the app

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

### Environment variables

| Name | Description |
| --- | --- |
| MONGODB_URI | MongoDB connection string |
| PORT | Backend port |
| ACCESS_TOKEN_SECRET | Secret used to sign access tokens |
| REFRESH_TOKEN_SECRET | Secret used to sign refresh tokens |

## Project structure

```text
Notes-App/
├── backend/                  # Express API and MongoDB connection
│   ├── src/app/              # Express app setup and static hosting
│   ├── src/config/           # Environment config and DB connection
│   ├── src/controllers/      # Request handlers for auth and notes
│   ├── src/middlewares/      # Auth middleware
│   ├── src/models/           # User and note Mongoose schemas
│   ├── src/routes/           # Auth and notes routes
│   └── src/server.js         # Application entry point
├── frontend/                 # React app
│   ├── src/api/              # API calls to the backend
│   ├── src/components/       # Reusable UI components
│   ├── src/pages/            # Home, login, register, 404 screens
│   ├── src/routes/           # Route definitions
│   └── src/store/            # App state setup
└── README.md                # Project documentation
```

## Deployment

[TODO(author): Where is the frontend hosted?]

[TODO(author): Where is the backend hosted?]

## Known limitations

- No pagination is implemented for notes
- No automated tests are included in the repository
- Search is client-side only and does not run on the backend
- Auth and note routes are protected by token checks, but there is no role system or admin layer
- The code does not include deployment configuration or CI setup

## TODOs

1. What is the live demo URL?
2. Where is the frontend hosted?
3. Where is the backend hosted?
