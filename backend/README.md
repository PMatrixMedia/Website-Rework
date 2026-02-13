# PhaseMatrix Blog API

Python Flask backend with MySQL for the blog.

## Prerequisites

- **Python 3.10+**
- **MySQL 8.0+**

## Setup

### 1. Install Python

Download and install Python from [python.org](https://www.python.org/downloads/). Verify:

```bash
python --version
pip --version
```

### 2. Install MySQL

- **Windows**: [MySQL Installer](https://dev.mysql.com/downloads/installer/)
- **macOS**: `brew install mysql`
- **Linux**: `sudo apt install mysql-server` (Ubuntu) or equivalent

Start MySQL and create the database:

```bash
mysql -u root -p < init_db.sql
```

Or run the SQL manually in MySQL Workbench / command line.

### 3. Configure Environment

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
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

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/posts` | List all posts |
| GET | `/api/posts/<id>` | Get single post |

## Frontend Integration

Add to your Next.js `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```
