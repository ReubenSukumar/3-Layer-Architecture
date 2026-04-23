CREATE DATABASE IF NOT EXISTS random
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'testuser'@'%' IDENTIFIED BY 'replace-with-strong-password';
GRANT ALL PRIVILEGES ON random.* TO 'testuser'@'%';
FLUSH PRIVILEGES;
