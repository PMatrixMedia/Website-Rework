import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from graphql import graphql_sync

import psycopg2
from psycopg2 import Error
from psycopg2.extras import RealDictCursor

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"])


def get_db_connection():
    """Create and return a PostgreSQL database connection.
    Uses DATABASE_URL if set (e.g. Supabase), otherwise falls back to individual vars.
    """
    try:
        database_url = os.getenv("DATABASE_URL")
        if database_url:
            conn = psycopg2.connect(database_url)
        else:
            conn = psycopg2.connect(
                host=os.getenv("PGHOST", "localhost"),
                port=int(os.getenv("PGPORT", "5432")),
                user=os.getenv("PGUSER", "postgres"),
                password=os.getenv("PGPASSWORD", ""),
                dbname=os.getenv("PGDATABASE", "phasematrix_blog"),
            )
        return conn
    except Error as e:
        print(f"Database connection error: {e}")
        return None


def _get_post_tags(conn, post_id):
    """Get tags for a post."""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT t.name FROM tags t
            JOIN post_tags pt ON t.id = pt.tag_id
            WHERE pt.post_id = %s
        """, (post_id,))
        return [r["name"] for r in cursor.fetchall()]
    except Error:
        return []


def _fetch_posts():
    """Fetch all posts for GraphQL."""
    conn = get_db_connection()
    if not conn:
        return []

    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT p.id, p.title, p.excerpt, p.content, p.image_url as image,
                   p.created_at, p.updated_at,
                   a.name as author_name, a.avatar_url as author_avatar
            FROM posts p
            LEFT JOIN authors a ON p.author_id = a.id
            ORDER BY p.created_at DESC
        """)
        rows = cursor.fetchall()
        posts = []
        for row in rows:
            posts.append({
                "id": row["id"],
                "title": row["title"],
                "excerpt": row["excerpt"] or "",
                "content": row["content"] or "",
                "image": row["image"],
                "date": row["created_at"].strftime("%b %d, %Y") if row["created_at"] else "",
                "author": {
                    "name": row["author_name"] or "Anonymous",
                    "avatar": row["author_avatar"],
                },
                "tags": _get_post_tags(conn, row["id"]),
            })
        cursor.close()
        conn.close()
        return posts
    except Error:
        if conn:
            conn.close()
        return []


def _fetch_post(post_id):
    """Fetch single post for GraphQL."""
    conn = get_db_connection()
    if not conn:
        return None

    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT p.id, p.title, p.excerpt, p.content, p.image_url as image,
                   p.created_at, p.updated_at,
                   a.name as author_name, a.avatar_url as author_avatar
            FROM posts p
            LEFT JOIN authors a ON p.author_id = a.id
            WHERE p.id = %s
        """, (post_id,))
        row = cursor.fetchone()
        cursor.close()
        conn.close()

        if not row:
            return None

        post = {
            "id": row["id"],
            "title": row["title"],
            "excerpt": row["excerpt"] or "",
            "content": row["content"] or "",
            "image": row["image"],
            "date": row["created_at"].strftime("%b %d, %Y") if row["created_at"] else "",
            "author": {
                "name": row["author_name"] or "Anonymous",
                "avatar": row["author_avatar"],
            },
        }
        conn2 = get_db_connection()
        if conn2:
            post["tags"] = _get_post_tags(conn2, row["id"])
            conn2.close()
        return post
    except Error:
        if conn:
            conn.close()
        return None


@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "service": "blog-api"})


@app.route("/graphql", methods=["POST"])
def graphql():
    """GraphQL endpoint."""
    from schema import schema

    data = request.get_json()
    if not data:
        return jsonify({"errors": [{"message": "No query provided"}]}), 400

    query = data.get("query")
    variables = data.get("variables") or {}

    result = graphql_sync(schema, query, variable_values=variables)

    response = {"data": result.data}
    if result.errors:
        response["errors"] = [{"message": e.message} for e in result.errors]

    return jsonify(response)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
