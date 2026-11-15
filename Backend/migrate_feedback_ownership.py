"""
Migration script: Add nullable user_id column to the feedback table.

This script is standalone and idempotent. It does NOT modify or recreate any
existing tables, does NOT delete any rows, and does NOT set default values.
Existing feedback rows keep NULL user_id until owned feedback is submitted.

Usage (manual execution only, after you have backed up the database):
    python Backend/migrate_feedback_ownership.py
"""

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "feedbackiq.db")


def column_exists(cursor, table_name: str, column_name: str) -> bool:
    cursor.execute(f"PRAGMA table_info({table_name})")
    columns = [row[1] for row in cursor.fetchall()]
    return column_name in columns


def row_counts(cursor) -> dict:
    counts = {}
    for table in ("users", "feedback"):
        counts[table] = cursor.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
    return counts


def run_migration() -> None:
    if not os.path.exists(DB_PATH):
        raise FileNotFoundError(f"Database file not found: {DB_PATH}")

    conn = sqlite3.connect(DB_PATH)
    try:
        cur = conn.cursor()

        # Capture row counts BEFORE migration
        before = row_counts(cur)
        print(f"[BEFORE] users={before['users']}, feedback={before['feedback']}")

        # Add user_id column only if it does not already exist
        if not column_exists(cur, "feedback", "user_id"):
            print("[MIGRATE] Adding nullable user_id column to feedback table...")
            cur.execute(
                "ALTER TABLE feedback ADD COLUMN user_id INTEGER"
            )
            conn.commit()
            print("[MIGRATE] user_id column added successfully.")
        else:
            print("[SKIP] user_id column already exists. No schema change made.")

        # Create index idempotently
        print("[MIGRATE] Ensuring index ix_feedback_user_id exists...")
        cur.execute(
            "CREATE INDEX IF NOT EXISTS ix_feedback_user_id ON feedback(user_id)"
        )
        conn.commit()
        print("[MIGRATE] Index ensured.")

        # Capture row counts AFTER migration
        after = row_counts(cur)
        print(f"[AFTER]  users={after['users']}, feedback={after['feedback']}")

        # Verify row counts are unchanged
        if before != after:
            raise RuntimeError(
                f"Row count mismatch! Before={before}, After={after}. "
                "Migration aborted — no data should have been added or removed."
            )

        # Show schema of feedback table for confirmation
        cur.execute("PRAGMA table_info(feedback)")
        print("[SCHEMA] feedback table columns:")
        for row in cur.fetchall():
            print(f"  {row}")

        print("[COMPLETE] Migration finished successfully. All records preserved.")

    finally:
        conn.close()


if __name__ == "__main__":
    run_migration()