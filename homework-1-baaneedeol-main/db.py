import os
from contextlib import contextmanager
from flask import current_app
import psycopg2
from psycopg2.pool import ThreadedConnectionPool
from psycopg2.extras import DictCursor

pool = None

def setup(app):
    global pool
    DATABASE_URL = os.environ['DATABASE_URL']
    current_app.logger.info("Creating DB connection pool")
    pool = ThreadedConnectionPool(1, 20, dsn=DATABASE_URL, sslmode='require')

@contextmanager
def get_db_connection():
    conn = pool.getconn()
    try:
        yield conn
    finally:
        pool.putconn(conn)

@contextmanager
def get_db_cursor(commit=False):
    with get_db_connection() as conn:
        cur = conn.cursor(cursor_factory=DictCursor)
        try:
            yield cur
            if commit:
                conn.commit()
        finally:
            cur.close()


def add_response(name, genre, favorite, feedback, timestamp, watching, recommend):
    with get_db_cursor(commit=True) as cur:
        cur.execute(
            "INSERT INTO survey_responses (name, genre, favorite, feedback, timestamp, watching, recommend) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (name, genre, favorite, feedback, timestamp, watching, recommend)
        )

def get_responses():
    with get_db_cursor() as cur:
        cur.execute("SELECT * FROM survey_responses ORDER BY id ASC")
        return cur.fetchall()
