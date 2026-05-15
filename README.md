# Internal Wiki System

A full-stack, role-based internal knowledge base application inspired by tools like Confluence and Notion. It enables teams to create, collaborate, and manage documentation with a secure, centralized platform.

## Key Features

- **Role-Based Access Control (RBAC)**: Secure access with two primary roles: `CONTRIBUTOR` (write/edit) and `EDITOR` (archive/restore/delete).
- **Article Lifecycle Management**: Seamlessly move articles through `DRAFT`, `PUBLISHED`, and `ARCHIVED` statuses.
- **Collaborative Editing & Version History**: Any authorized user can edit published articles, with every change automatically saved as a version snapshot.
- **Search & Filtering**: Quickly find content by searching titles/bodies or filtering by category and status.
- **Security & Authentication**: JWT-based authentication with bcrypt password hashing protects your data.

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: SQLite (via Prisma ORM)

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/venkat6327/internal-wiki-system.git
   cd internal-wiki-system
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your_super_secret_jwt_key"
   ```
   Initialize the database and start the server:
   ```bash
   npx prisma generate
   npx prisma db push
   npm run dev
   ```

3. **Setup the Frontend:**
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

The application will be available at `http://localhost:5173`.
