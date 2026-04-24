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
```
---

## 🌐 Frontend   

The frontend is a static web application built using:  

▪ **HTML** for structure  
▪ **CSS** for styling  
▪ **JavaScript** for interactivity  



### Features  
  
▪ User creation interface (add-user)  
▪ Data visualization (high-table)  
▪ Location-based functionality (location)  
▪ Status/timer-based UI (excommunicado)  
▪ Shared assets and styling  

The frontend is modular, with each feature organized into its own directory.  

## ⚙️ Backend

The backend is a **Spring Boot application** that exposes REST APIs.

### Architecture  
```text
Controller Layer  → Handles HTTP requests
Service Layer     → Business logic
Repository Layer  → Data access
DTO Layer         → Request/response abstraction
```
### Key Components  
```text
UserController         → User-related APIs
HealthController       → Health check endpoint
UserService            → Core business logic
UserRepository         → Data persistence
User                   → Entity model
UserMapper             → DTO ↔ Entity mapping
GlobalExceptionHandler → Centralized error handling
```

### Configuration  
▪ application.properties for runtime configuration  
▪ Maven (pom.xml) for build and dependency management  

---

## 🛠️ Deployment

The project includes deployment-ready configurations:  

### MySQL

▪ ```textbootstrap.sql``` initializes the database schema  

### NGINX

▪ ```textjw-frontend.conf``` for serving frontend and routing traffic    

### Systemd

▪ ```textjw-registry.service``` to run the backend as a service  
▪ ```textjw-registry.env.example``` for environment variable configuration  

### Documentation

▪ ```textDEPLOYMENT.md``` contains additional setup instructions

---

## 🔄 CI/CD Pipeline  

The project follows a pipeline-driven deployment approach combining build, provisioning, and configuration.  

### Pipeline Flow   

#### 1.Source Checkout  
   ▪ Fetches the selected branch from version control 

#### 2.Build Stage  
   ▪ Backend is built using Maven  
   ▪ Generates executable .jar artifact  

#### 3.Infrastructure Provisioning  
   ▪ Terraform is used to provision:  
     ▪ Network resources  
     ▪ Compute instances  
     ▪ Security configurations  
     ▪ Load balancing (if configured)  

#### 4. Instance Configuration

▪ Shell scripts configure:
  - MySQL setup
  - NGINX installation and configuration
  - Runtime dependencies 

#### 5.Application Deployment  
   ▪ Backend runs via systemd  
   ▪ Frontend served through NGINX  

### Pipeline Components  
```text
Terraform      → Infrastructure provisioning  
Shell Scripts  → Instance bootstrap and setup  
Maven          → Backend build  
Systemd        → Service management  
```

---


## 🚀 How to Run  

### Backend  

```text
cd backend
mvn clean package
java -jar target/*.jar
```
### Frontend  
▪ Open index.html in a browser  
**or**  
▪ Serve via NGINX using provided configuration  

---

## 📦 Build & Dependencies  
▪ Backend uses Maven  
▪ Java-based application (Spring Boot)  
▪ Static frontend (no build step required)  

---

## 🧰 Development Setup  
▪ .vscode/settings.json included for editor configuration  
▪ Suitable for local development and testing  

---

## 📌 Notes  
▪ The repository includes compiled backend artifacts (target/)  
▪ Designed with modular separation of concerns  
▪ Includes both application code and deployment configuration for a full-stack setup  

---

## 🎯 Purpose

This project demonstrates:  

▪ Full-stack application structure  
▪ Backend API design with Spring Boot  
▪ Static frontend integration  
▪ Deployment configuration using system tools (NGINX, systemd, MySQL)  


## 👨‍💻 Author    
  
**Reuben Sukumar R**  
**Cloud / DevOps Engineer**  