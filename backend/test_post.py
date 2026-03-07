#!/usr/bin/env python3
"""Create a test post and verify it writes to the database."""
import os
import sys

# Load env from backend directory
from dotenv import load_dotenv
load_dotenv()

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import _create_post

def main():
    if not os.getenv("DATABASE_URL") and not os.getenv("PGHOST"):
        print("Error: Set DATABASE_URL or PGHOST/PGPASSWORD in .env")
        sys.exit(1)

    post = _create_post(
        title="Test Post from Script",
        excerpt="A test post to verify database writes.",
        content="This post was created by test_post.py to verify the blog app writes to the database correctly.",
    )

    if post:
        print("Success! Test post created:")
        print(f"  ID: {post['id']}")
        print(f"  Title: {post['title']}")
        print(f"  Date: {post['date']}")
        print("\nPost written to database.")
    else:
        print("Error: Failed to create post. Check DATABASE_URL and database connection.")
        sys.exit(1)

if __name__ == "__main__":
    main()
