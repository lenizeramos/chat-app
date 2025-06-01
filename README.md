> **Note:** This repository is a personal backup of coursework originally developed as part of my studies at Cornerstone College. It was cloned from a institutional and private repository to preserve my contributions and development history.

# Real-Time Chat Application

This project is a real-time chat application that allows users to:

- Register and log in.
- Search for other users and send messages, pictures, or files.
- Create groups and add users to them.

## Getting Started

### Prerequisites

- Node.js and npm installed on your system.
- PostgreSQL database set up locally or on a server.
- Prisma installed globally (optional but recommended).

### Installation

1. Clone the repository and navigate to the project directory.

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

4. Create a `.env` file in the root directory and add the following content:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DB?schema=public"
   ```
   Replace `USER`, `PASSWORD`, and `DB` with your PostgreSQL credentials.

5. Push the database schema to your database:
   ```bash
   npx prisma db push
   ```

6. Seed the database:
   ```bash
   npx prisma db seed
   ```

7. Run the development server:
   ```bash
   npm run dev
   ```

The application should now be running at `http://localhost:8080`.

## Endpoints

### Authentication Routes
- `GET /auth` - Render authentication page if session is inactive.
- `POST /auth/login` - Log in a user.
- `POST /auth/register` - Register a new user.
- `GET /auth/logout` - Log out a user.

### Home Routes
- `GET /` - Render the homepage if the session is active.
- `GET /search-users` - Search for users.

### Chat Routes
- `GET /chat/users` - Retrieve a list of users.
- `POST /chat/direct` - Create a direct chat.
- `POST /chat/group` - Create a group chat.
- `POST /chat/upload` - Upload a file attachment.

## Notes

- Ensure that your PostgreSQL server is running and the credentials in `.env` are correct.
- This project uses Prisma for database management and migrations.
