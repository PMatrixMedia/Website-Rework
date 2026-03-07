# PhaseMatrix Blog API

Python Flask backend with PostgreSQL for the blog.

## Prerequisites

- **Python 3.10+**
- **PostgreSQL-compatible database** (Neon recommended)

## Neon quick start (recommended)

Use your Neon resources:

- Org: `org-sweet-hat-08378913`
- Project: `little-surf-12235556` (`blog`)

### 1. Get a Neon connection string

1. Open [Neon Console](https://console.neon.tech/)
2. Select project `blog`
3. Copy the pooled PostgreSQL URI from **Connection Details**

### 2. Configure environment

```bash
cd backend
cp .env.example .env
# Paste your Neon URI into DATABASE_URL in .env
```

### 3. Initialize schema

```bash
psql "<YOUR_NEON_DATABASE_URL>" -f init_db.sql
```

### 4. Run API

```bash
pip install -r requirements.txt
python app.py
```

## Setup

### 1. Install Python

Download and install Python from [python.org](https://www.python.org/downloads/). Verify:

```bash
python --version
pip --version
```

### 2. Install PostgreSQL (local-only option)

- **Windows**: [PostgreSQL Installer](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql`
- **Linux**: `sudo apt install postgresql postgresql-contrib` (Ubuntu) or equivalent

Create the database and run the schema:

```bash
createdb phasematrix_blog
psql -U postgres -d phasematrix_blog -f init_db.sql
```

Or run the SQL manually in psql or pgAdmin.

### 3. Configure Environment

```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Run the API

```bash
python app.py
```

API runs at `http://localhost:5000`.

## API Endpoints

### GraphQL (primary for blog)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/graphql` | GraphQL API |

**Example query – list posts:**
```graphql
query GetPosts {
  posts {
    id title excerpt image date
    author { name avatar }
    tags
  }
}
```

**Example query – single post:**
```graphql
query GetPost($id: Int!) {
  post(id: $id) {
    id title excerpt content image date
    author { name avatar }
    tags
  }
}
```

### REST (legacy)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/posts` | List all posts |
| GET | `/api/posts/<id>` | Get single post |

## Frontend Integration

Add to your Next.js `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
# Or for GraphQL directly:
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:5000/graphql
```
