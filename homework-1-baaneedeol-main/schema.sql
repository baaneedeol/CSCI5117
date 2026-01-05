CREATE TABLE survey_responses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    genre TEXT NOT NULL,
    favorite TEXT NOT NULL,
    watching TEXT NOT NULL,
    recommend BOOLEAN NOT NULL,
    feedback TEXT,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
