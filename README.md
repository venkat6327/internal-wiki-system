# Internal Wiki System

A full-stack, role-based internal knowledge base application built to ensure secure collaboration within an organization. It allows users to register, create, edit, publish, and archive articles with an automated version history.

## Features

- **Authentication & Authorization**: Secure JWT-based authentication. Two primary roles: `CONTRIBUTOR` (write/edit) and `EDITOR` (full editorial control including archiving, restoring, and deleting).
- **Article Lifecycle Management**: Articles can exist in three states: `DRAFT`, `PUBLISHED`, and `ARCHIVED`.
- **Version History**: Automatic snapshotting of article versions when published or edited, maintaining a complete history of changes.
- **Search & Filtering**: Search articles by keyword (title/body), and filter them by category and status.
- **Pagination & Sorting**: Efficiently paginate through articles and sort them by attributes like title and creation date.

## Technology Stack

- **Frontend**: React, Vite, React Router
- **Backend**: Node.js, Express
- **Database**: SQLite
- **ORM**: Prisma
- **Authentication**: JWT & bcrypt

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/venkat6327/internal-wiki-system.git
   cd internal-wiki-system
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Configure Backend Environment:
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your_super_secret_jwt_key"
   ```

4. Setup Database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

6. Install frontend dependencies and start the app:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

The frontend will start running on `http://localhost:5173` and the backend on `http://localhost:5000`.

## Role Details
- **Contributor**: Can create Drafts, publish their own Drafts, and edit any Published article.
- **Editor**: Can do all the above plus Archive, Restore, and Delete articles across the platform.
