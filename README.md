# Internal Wiki System

A full-stack Internal Knowledge Base / Wiki platform inspired by Confluence and MediaWiki, built for collaborative article management inside organizations.

The platform allows authenticated users to create, edit, publish, search, version, archive, and manage internal documentation through a wiki-style collaborative workflow.

---

# Features

## Authentication & Authorization

* User registration and login
* JWT-based authentication
* Password hashing using bcrypt
* Protected routes and APIs
* Role-based access control (Contributor / Editor)

---

## Article Management

* Create draft articles
* Publish articles
* Edit published articles collaboratively
* Delete draft articles
* Archive and restore articles
* Category-based organization

---

## Version History

* Automatic version creation for published edits
* Sequential version numbering
* View previous article versions
* Track editor identity and timestamps
* Optional edit summaries

---

## Search, Filtering & Pagination

* Full-text search (title + body)
* Category filtering
* Status filtering
* Sorting support
* Pagination support

---

# Tech Stack

## Frontend

* React
* Vite
* TailwindCSS
* React Router
* Axios

## Backend

* Node.js
* Express.js
* Prisma ORM
* JWT Authentication
* bcrypt

## Database

* SQLite

---

# Why This Stack?

## React + Vite

Used for rapid frontend development, reusable components, and fast rendering.

Vite provides:

* fast startup
* instant hot reload
* lightweight configuration

---

## Express.js

Chosen because it is lightweight, flexible, and ideal for REST API development.

---

## Prisma ORM

Prisma simplifies database management using schema-based modeling and provides:

* type-safe queries
* easier relationship management
* migration support
* faster development

---

## SQLite

SQLite was selected for the hackathon because:

* zero setup required
* lightweight
* single-file persistence
* fast local development

---

# Project Architecture

```text
Frontend (React)
       ↓
REST API (Express)
       ↓
Prisma ORM
       ↓
SQLite Database
```

---

# Database Design

## User

Stores:

* email
* password hash
* role

---

## Article

Stores:

* title
* body
* category
* status
* creator
* timestamps

---

## ArticleVersion

Stores:

* version number
* historical content snapshot
* editor identity
* timestamp
* edit summary

---

# Authentication Flow

1. User registers with email/password
2. Password hashed using bcrypt
3. User logs in
4. JWT token generated
5. Frontend stores token
6. Protected APIs verify JWT token

---

# Role-Based Access Control

## Contributor

Can:

* create articles
* edit published articles
* manage own drafts

Cannot:

* archive articles
* restore articles
* delete others' articles

---

## Editor

Can:

* archive articles
* restore articles
* delete articles
* manage lifecycle actions

---

# Article Lifecycle

## Draft

* visible only to creator
* editable only by creator

## Published

* visible to all authenticated users
* collaboratively editable
* version history enabled

## Archived

* hidden from default listing/search
* read-only
* restorable by editor

---

# API Endpoints

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

## Articles

```text
GET /api/articles
POST /api/articles
GET /api/articles/:id
PUT /api/articles/:id
DELETE /api/articles/:id
```

## Article Lifecycle

```text
POST /api/articles/:id/publish
POST /api/articles/:id/archive
POST /api/articles/:id/restore
```

## Versions

```text
GET /api/articles/:id/versions
```

---

# Setup Instructions

# 1. Clone Repository

```bash
git clone <repository-url>
cd internal-wiki-system
```

---

# 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
```

Run Prisma migration:

```bash
npx prisma migrate dev
npx prisma generate
```

Start backend:

```bash
npm run dev
```

---

# 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# Default Editor Account

Example seeded editor account:

```text
Email: editor@test.com
Password: password123
Role: EDITOR
```

---

# Security Features

* bcrypt password hashing
* JWT authentication
* Protected APIs
* Draft access control
* Role-based permissions
* Validation for all inputs

---

# AI Usage

AI tools were actively used during development to accelerate implementation and debugging.

Tools used:

* ChatGPT
* Cursor AI / Antigravity

AI assistance was used for:

* boilerplate generation
* Prisma schema design
* debugging
* API structure
* frontend components
* validation logic
* access-control fixes

All generated code was manually reviewed, modified, tested, and integrated.

---

# Assumptions

* All users belong to the same organization
* No multi-tenant separation required
* SQLite sufficient for hackathon-scale persistence
* Editor role seeded manually
* Markdown editing simplified to plain text

---

# Tradeoffs

Due to the 6-hour hackathon constraint, the following were intentionally deprioritized:

* real-time collaborative editing
* markdown rendering
* diff comparison UI
* notifications
* Docker deployment
* advanced search ranking
* SSO/OAuth

Priority was given to:

* correctness
* RBAC
* version history
* authentication
* search/filter/pagination

---

# Future Improvements

Potential future enhancements:

* Markdown support
* Side-by-side diff view
* Real-time collaboration
* Elasticsearch integration
* PostgreSQL migration
* Docker deployment
* Notifications
* Bookmarks/favorites
* Tags/labels
* Rich text editor

---

# Challenges Faced

* Designing collaborative editing rules
* Correct draft visibility enforcement
* Version history consistency
* Managing RBAC securely
* Search/filter/pagination integration
* Prisma enum migration and validation

---

# Key Learning Outcomes

This project provided hands-on experience with:

* full-stack system design
* REST API architecture
* authentication & authorization
* Prisma ORM
* relational database modeling
* version-control systems inside applications
* scalable filtering/pagination/search
* frontend/backend integration

---

# Screenshots

(Add screenshots here if available)

---

# Author

Developed as a hackathon project for building a scalable Internal Knowledge Base / Wiki System.
