DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'user') THEN
        CREATE USER "user" WITH PASSWORD 'password';
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS questions(
    question_id VARCHAR(255) PRIMARY KEY,
    title TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(255) NOT NULL,
    complexity VARCHAR(255) NOT NULL
);
