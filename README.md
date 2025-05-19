# 🛒 Full-Stack E-commerce Web Application

A modern, full-featured e-commerce platform built with **Angular** (frontend) and **Spring Boot** (backend), supporting buyers, sellers, and administrators. This system includes secure authentication, product management, role-based dashboards, and Stripe integration for payments.

---

## 📁 Project Structure

- **Frontend:** Angular (SPA with Tailwind CSS)
- **Backend:** Spring Boot (REST APIs, JWT Auth, MySQL, Stripe)
- **Database:** MySQL with Hibernate ORM
- **Authentication:** JWT-based login, refresh, and role management

---

## 🚀 Features

### 👤 Buyer
- Browse, search, and filter products
- View product details and variants
- Add items to cart and place orders
- Stripe payment integration (sandbox)
- Track orders, write reviews, manage favorites

### 🛍️ Seller
- Register via seller form
- Add, edit, and manage products and variants
- Track product statuses and sales
- View analytics and fulfill orders

### 🔧 Admin
- Moderate all users and products
- Approve, ban, or reject seller submissions
- Resolve order/payment issues
- Manage product categories

### 🔓 Guest
- View products and public reviews
- Must log in to add items to cart or place orders

---

## 🛠️ Setup & Configuration

### 📦 Backend (`backend`)

applicationProperties



Update application.properties accordingly:

spring.datasource.url=jdbc:mysql://localhost:3306/${DB_NAME}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASS}
jwt.secret=${JWT_SECRET}
stripe.api.key=${STRIPE_SECRET_KEY}

🌐 Frontend (frontend)

In src/environments/environment.ts:

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  stripePublishableKey: 'your_stripe_publishable_key'
};

▶️ Running the Application
Backend
bash
Kopyala
Düzenle
cd backend
mvn clean install
mvn spring-boot:run
Frontend
bash
Kopyala
Düzenle
cd frontend
npm install
npm start
Visit: http://localhost:4200

🔐 User Management Flow
Registration: Role-based (buyer / seller), with corporate field for sellers

Login: JWT access & refresh tokens stored client-side

Logout: Refresh token invalidated server-side

Profile Management: Name, email, password updates (with validation)

👥 Roles & Permissions
Role	Access & Features
Buyer	Cart, checkout, track orders, reviews, Stripe payments
Seller	Product listing, variant management, order analytics
Admin	User moderation, product approval, category and refund management
Guest	View public data, must login to interact with cart/orders

🔄 Application Flow
Buyers: Browse → Login → Add to cart → Checkout → Track order → Review

Sellers: Register → Submit product → Wait approval → Receive & ship orders

Admins: Login → Approve products → Monitor users/orders → Manage issues/categories

📊 ER Diagram
See the ER diagram section in the project report or open via Workbench for structure.

👨‍💻 Developers
Pelin Sağlamer – 20230808066

İsa Ölmez – 20220808032

Created as part of CSE 214 - Advanced Application Development.
