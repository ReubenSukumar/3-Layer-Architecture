CREATE DATABASE IF NOT EXISTS jw_registry
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'jw_registry_user'@'%' IDENTIFIED BY 'replace-with-strong-password';
GRANT ALL PRIVILEGES ON jw_registry.* TO 'jw_registry_user'@'%';
FLUSH PRIVILEGES;
