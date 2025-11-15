# 🚀 Feedback Site API

A full-featured API built with **Node.js**, designed to let users **suggest features**, **vote** for others’ ideas, and **discuss** improvements through comments.  
It creates a small, collaborative community where users help shape a project by submitting and evaluating ideas.

---

## 🏷️ Badges  
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge)
![Express](https://img.shields.io/badge/Express.js-Framework-blue?style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge)
![Sequelize](https://img.shields.io/badge/Sequelize-ORM-3A76F0?style=for-the-badge)
![JWT](https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge)
![Jest](https://img.shields.io/badge/Tests-Jest-red?style=for-the-badge)
![Swagger](https://img.shields.io/badge/API-Docs-brightgreen?style=for-the-badge)

---

## ✨ Features

- 📝 Users can **submit feature suggestions**
- 👍 Users can **vote** for other users’ ideas
- 💬 Users can **comment** under each feature to refine discussions
- 🔐 **Stateless authentication** using JWT
- 🗄️ Complex relational database design using **MySQL** + **Sequelize**
- 🧪 Includes **Unit** and **Integration tests** (Jest + Supertest)
- 📬 Email support using **Nodemailer** + SMTP
- 🧩 Complete API documentation with **Swagger**

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MySQL**  
- **Sequelize ORM**
- **JWT** for authentication
- **Joi** for validation
- **Nodemailer** (SMTP email service)
- **bcrypt** for hashing sensitive data
- **Jest + Supertest** for testing
- **Swagger JSDoc + Swagger UI** for documentation

---

## 📦 Project Structure
```
feedbackSite
│
├── models/ # Table definitions + relationships
├── services/ # Core business logic (CRUD, voting, liking, etc.)
├── controllers/ # Handle requests and responses using services
├── validations/ # Validate incoming request data (Joi)
├── swagger/ # Swagger schemas and components
├── middleware/ # Authentication, error handling, etc.
├── tests/ # Unit & integration tests (Jest + Supertest)
└── utilities/ # App configuration (emailing, JWT helpers, AppError, ...)
```

---

## 🔐 Authentication & Authorization

- Implemented using **stateless JWT authentication**
- Minimal database load thanks to token-based verification  
- Secure password storage using **bcrypt** hashing

---

## 🗃️ Database

This project uses **MySQL** for managing data with **Sequelize ORM**.  
Because the platform includes voting, liking, commenting, and user interaction, it required **advanced relational modeling** (the correct word for “پیچیده” اینجا **complex** or **highly relational** است، من “complex relational structure” گذاشتم).

---

## 📬 Email System

The project uses:

- **Nodemailer**  
- **SMTP configuration**  

…to send verification, notification, or other system emails.

---

## 🧪 Testing

Testing stack includes:

- **Jest** → test runner  
- **Supertest** → API endpoint testing  

Covers both **unit tests** and **integration tests**.

---

## 📚 API Documentation

Generated automatically via:

- `swagger-jsdoc`  
- `swagger-ui-express`

You can access the full documentation in the `/api-docs` route after running the project.

---

## 🚀 How to Run the Project

```bash
git clone <your-repo-url>
cd feedbackSite
npm install
npm run dev

Make sure to configure your .env file:
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

📝 Roadmap / TODO

 Add admin dashboard

 Add notification service

 Improve voting analytics

 Add rate limiting