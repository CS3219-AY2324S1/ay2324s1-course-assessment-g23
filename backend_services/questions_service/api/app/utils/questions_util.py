from questions_database import QUESTIONS_DATABASE as db


def qid_exists(qid: str) -> bool:
    cur = db.execute_sql_read_fetchone(
        "SELECT EXISTS (SELECT 1 FROM questions WHERE question_id = %s)", params=(qid,)
    )
    assert cur is not None and isinstance(cur[0], bool)
    return cur[0]


def title_exists(title: str) -> bool:
    cur = db.execute_sql_read_fetchone(
        "SELECT EXISTS (SELECT 1 FROM questions WHERE title = %s)", params=(title,)
    )
    assert cur is not None and isinstance(cur[0], bool)
    return cur[0]


def check_duplicate_title(qid: str, title: str) -> bool:
    cur = db.execute_sql_read_fetchone(
        "SELECT EXISTS (SELECT 1 FROM questions WHERE title = %s AND question_id != %s)",
        params=(
            title,
            qid,
        ),
    )
    assert cur is not None and isinstance(cur[0], bool)
    return cur[0]
