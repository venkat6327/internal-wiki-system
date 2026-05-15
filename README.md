# 📚 Internal Wiki System

A full-stack Internal Knowledge Base platform inspired by Confluence and MediaWiki — built for collaborative article management inside organizations.

---

## ✨ Features

- **Authentication** — Register/login with JWT-based auth and bcrypt password hashing
- **Role-Based Access Control** — Contributor and Editor roles with distinct permissions
- **Article Lifecycle** — Draft → Published → Archived workflow
- **Version History** — Automatic versioning on every published edit, with editor identity and timestamps
- **Collaborative Editing** — All authenticated users can contribute to published articles
- **Search, Filter & Pagination** — Full-text search across title and body, category/status filters, sorting

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, TailwindCSS, React Router, Axios |
| Backend | Node.js, Express.js, Prisma ORM |
| Database | SQLite |
| Auth | JWT, bcrypt |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd internal-wiki-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
```

Run migrations and start the server:

```bash
npx prisma migrate dev
npx prisma generate
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Default Editor Account

```
Email:    editor@test.com
Password: password123
Role:     EDITOR
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/articles` | List articles (search, filter, paginate) |
| POST | `/api/articles` | Create a draft article |
| GET | `/api/articles/:id` | Get article by ID |
| PUT | `/api/articles/:id` | Edit an article |
| DELETE | `/api/articles/:id` | Delete an article |
| POST | `/api/articles/:id/publish` | Publish a draft |
| POST | `/api/articles/:id/archive` | Archive an article |
| POST | `/api/articles/:id/restore` | Restore an archived article |
| GET | `/api/articles/:id/versions` | Get version history |

---

## 🔐 Role Permissions

| Action | Contributor | Editor |
|---|:---:|:---:|
| Create articles | ✅ | ✅ |
| Edit published articles | ✅ | ✅ |
| Manage own drafts | ✅ | ✅ |
| Archive / Restore articles | ❌ | ✅ |
| Delete others' articles | ❌ | ✅ |

---

## 🏗️ Architecture

```
Frontend (React + Vite)
        ↓
  REST API (Express)
        ↓
   Prisma ORM
        ↓
 SQLite Database
```

---

## ⚖️ Tradeoffs & Scope

Built under a **6-hour hackathon constraint**. The following were intentionally deprioritized:

- Real-time collaborative editing
- Markdown rendering & diff comparison UI
- Docker deployment
- SSO / OAuth

Priority was given to correctness, RBAC, version history, and search/filter/pagination.

---

## 🔮 Future Improvements

- Markdown support with rich text editor
- Side-by-side diff view for version comparison
- Real-time collaboration (WebSockets)
- PostgreSQL + Elasticsearch for production scale
- Docker deployment
- Notifications, bookmarks, and tags

---

## 👤 Author

Developed as a hackathon project for building a scalable Internal Knowledge Base / Wiki System.