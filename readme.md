<div align="center">

# 💬 Real-Time Chat & Admin Dashboard Application
### MERN Stack | Socket.io | Tailwind CSS v4 | MongoDB

A full-stack real-time communication platform supporting **instant global messaging**, **live community statistics**, and **administrative user management**. Built with a focus on real-time data synchronization and secure access control.

<!-- Badges -->
<p>
  <img src="https://img.shields.io/badge/React-v19-61DAFB?style=flat&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Socket.io-Realtime-010101?style=flat&logo=socket.io&logoColor=white" alt="Socket.io" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=flat&logo=node.js&logoColor=white" alt="Node" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=flat&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=flat&logo=tailwind-css&logoColor=white" alt="Tailwind" />
</p>

</div>

---

## 📖 Architecture & Concepts

### 🔌 Persistent Bi-Directional Communication
This application leverages **WebSockets (Socket.io)** rather than standard polling to ensure a "Live" feel.

1.  **Handshake & Auth:** When a user connects, the Socket.io middleware verifies their JWT. Once verified, a persistent link is established between the user's browser and the server.
2.  **Real-Time Events:** 
    *   **Broadcasting:** When a message is sent, the server saves it to MongoDB and instantly "emits" it to all connected clients.
    *   **Admin Sync:** The server tracks message counts and online user counts, pushing live updates specifically to the Admin Dashboard without requiring a page refresh.

---

## 🚀 Key Features

### 📨 Messaging Experience
*   **Instant Delivery:** Low-latency message broadcasting using Socket.io.
*   **Global History:** Automated loading of the last  messages from MongoDB upon login.
*   **Smart Scrolling:** Chat window automatically stays at the bottom for new messages.
*   **User Avatars:** Dynamic initial-based avatars for all community members.

### 🛡️ Admin Dashboard (Command Center)
*   **Live Statistics:** Real-time counters for **Total Registered Users** and **Total Messages Sent**.
*   **Promotion System:** Securely promote standard users to `ADMIN` status via a protected API.
*   **Real-time Monitoring:** The dashboard updates counts automatically as users chat or register.

### 🔐 Security & State
*   **Role-Based Access (RBAC):** Specific routes like `/admin` are protected on both the Frontend (React Router) and Backend (Express Middleware).
*   **JWT Handshake:** Socket connections are rejected if a valid token is not provided.
*   **State Management:** Centralized `AuthContext` for user sessions and `SocketContext` for global event listeners.

## ⚙️ Installation & Setup
### 1. Backend Setup

```bash
cd backend
npm install

# Setup Environment (.env)
# PORT=5000
# MONGO_URI="your_mongodb_connection_string"
# JWT_SECRET="your_secure_secret_key"

npm run dev
```
### 2. Frontend Setup
```bash
cd frontend
npm install

# Ensure Tailwind v4 is imported in src/index.css
# @import "tailwindcss";

npm run dev
```
