CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);

CREATE TABLE boards (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  columns TEXT
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  "order" INT,
  description TEXT,
  "userId" INT REFERENCES users(id) ON DELETE SET NULL,
  "boardId" INT REFERENCES boards(id) ON DELETE CASCADE,
  "columnId" INT
);