# 🛒 E-commerce App

A full-stack e-commerce application built with **NestJS**, **Prisma**, **PostgreSQL**, and **Next.js**. It features **user registration/login**, **admin panel**, **product management**, and **order tracking**.

![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=flat-square)
![NestJS](https://img.shields.io/badge/Backend-NestJS-red?style=flat-square)
![NextJS](https://img.shields.io/badge/Frontend-Next.js-black?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?style=flat-square)
![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=flat-square)
![Status](https://img.shields.io/badge/Status-Complete-brightgreen?style=flat-square)

---

## 🚀 Features

### 👥 User
- Register/Login
- Browse Products
- Place Orders

### 🔐 Admin
- Secure Admin Login
- Manage Users (Edit/Delete)
- Manage Products (Add/Edit/Delete)
- View All Orders with User & Product Info

---

## 🧰 Tech Stack

| Layer      | Tech                     |
|------------|--------------------------|
| Frontend   | Next.js, Tailwind CSS    |
| Backend    | NestJS, TypeScript       |
| Database   | PostgreSQL (via pgAdmin) |
| ORM        | Prisma                   |
| Auth       | JWT (JSON Web Tokens)    |
| Tools      | VS Code, Postman, GitHub |

---

## 📁 Folder Structure

```bash
ecommerce-app/
├── backend/         # NestJS backend API
│   └── src/
│       ├── auth/
│       ├── users/
│       ├── products/
│       └── orders/
├── frontend/        # Next.js frontend (user & admin)
│   └── src/
│       ├── app/
│       ├── components/
│       └── styles/
└── README.md

---

**## 📦 Backend Setup (NestJS)**

# Navigate to backend
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env   # or create .env manually

# Initialize DB schema
npx prisma migrate dev

# Run the server
npm run start:dev

---

**💻 Frontend Setup (Next.js)**

# Navigate to frontend
cd ../frontend

# Install dependencies
npm install

# Run development server
npm run dev
