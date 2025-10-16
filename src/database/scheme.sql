CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY default gen_random_uuid(),
  name VARCHAR(100), 
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS boards (
  id uuid PRIMARY KEY default gen_random_uuid(),
  title VARCHAR(255) NOT NULL UNIQUE, 
  userId uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS columns (
  id uuid PRIMARY KEY default gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  "order" INT NOT NULL,
  boardId uuid NOT NULL REFERENCES boards(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY default gen_random_uuid(),
  title VARCHAR(255) NOT NULL, 
  "order" INT NOT NULL, 
  description TEXT,
  userId uuid NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  columnId uuid NOT NULL REFERENCES columns(id) ON DELETE CASCADE
);