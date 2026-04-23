# JW Platform

A full-stack web application built with a static frontend and a Java Spring Boot backend, along with deployment configurations for running the system in a production-like environment.

---

## 📌 Overview

JW Platform is designed as a modular application with:

- A **static frontend** for user interaction
- A **RESTful backend service** for handling business logic
- Supporting **deployment configurations** (NGINX, MySQL, systemd)

The project demonstrates structured application development along with system-level deployment setup.

---

## 🏗️ Project Structure

```text
JW Platform
│
├── frontend
│   ├── index.html
│   ├── style.css
│   │
│   ├── add-user
│   │   ├── add-user.html
│   │   ├── add-user.css
│   │   └── add-user.js
│   │
│   ├── high-table
│   │   ├── high-table.html
│   │   ├── high-table.css
│   │   └── high-table.js
│   │
│   ├── location
│   │   ├── location.html
│   │   ├── location.css
│   │   └── location.js
│   │
│   ├── excommunicado
│   │   ├── excommunicado.html
│   │   ├── excommunicado.css
│   │   └── excommunicado.js
│   │
│   └── assets
│       └── JW.jpg
│
├── backend
│   ├── pom.xml
│   ├── maven-settings.xml
│   │
│   ├── src/main/java/com/jwplatform/registry
│   │   ├── JwRegistryApplication.java
│   │   │
│   │   ├── config
│   │   │   └── WebConfig.java
│   │   │
│   │   ├── controller
│   │   │   ├── HealthController.java
│   │   │   └── UserController.java
│   │   │
│   │   ├── dto
│   │   │   ├── CreateUserRequest.java
│   │   │   ├── HealthResponse.java
│   │   │   ├── UserResponse.java
│   │   │   ├── UsersResponse.java
│   │   │   └── UserEnvelopeResponse.java
│   │   │
│   │   ├── entity
│   │   │   └── User.java
│   │   │
│   │   ├── exception
│   │   │   ├── ApiErrorResponse.java
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   └── UserNotFoundException.java
│   │   │
│   │   ├── mapper
│   │   │   └── UserMapper.java
│   │   │
│   │   ├── repository
│   │   │   └── UserRepository.java
│   │   │
│   │   └── service
│   │       └── UserService.java
│   │
│   ├── src/main/resources
│   │   └── application.properties
│   │
│   └── target
│
├── deploy
│   ├── DEPLOYMENT.md
│   │
│   ├── mysql
│   │   └── bootstrap.sql
│   │
│   ├── nginx
│   │   └── jw-frontend.conf
│   │
│   └── systemd
│       ├── jw-registry.service
│       └── jw-registry.env.example
│
└── .vscode
    └── settings.json