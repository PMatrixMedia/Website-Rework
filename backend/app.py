import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import Error

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"])

def get_db_connection():
    """Create and return a MySQL database connection."""
    try:
        conn = mysql.connector.connect(
            host=os.getenv("MYSQL_HOST", "localhost"),
            port=int(os.getenv("MYSQL_PORT", "3306")),
            user=os.getenv("MYSQL_USER", "root"),
            password=os.getenv("MYSQL_PASSWORD", ""),
            database=os.getenv("MYSQL_DATABASE", "phasematrix_blog"),
            charset="utf8mb4",
        )
        return conn
    except Error as e:
        print(f"Database connection error: {e}")
        return None


@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "service": "blog-api"})


@app.route("/api/posts", methods=["GET"])
def get_posts():
    """Get all blog posts."""
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database unavailable", "posts": []}), 503

    try:
        cursor = conn.cursor(dictionary=True)
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
        return jsonify({"posts": posts})
    except Error as e:
        conn.close()
        return jsonify({"error": str(e), "posts": []}), 500


@app.route("/api/posts/<int:post_id>", methods=["GET"])
def get_post(post_id):
    """Get a single blog post by ID."""
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database unavailable"}), 503

    try:
        cursor = conn.cursor(dictionary=True)
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
            return jsonify({"error": "Post not found"}), 404

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
        return jsonify(post)
    except Error as e:
        conn.close()
        return jsonify({"error": str(e)}), 500


def _get_post_tags(conn, post_id):
    """Get tags for a post."""
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT t.name FROM tags t
            JOIN post_tags pt ON t.id = pt.tag_id
            WHERE pt.post_id = %s
        """, (post_id,))
        return [r["name"] for r in cursor.fetchall()]
    except Error:
        return []


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
