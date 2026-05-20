 Real-Time Chat & Admin Dashboard App
A full-stack real-time chat application with a secure Admin Dashboard. Built using Node.js, Express, Socket.io, React, and Tailwind CSS v4.
📌 Features
Real-time Messaging: Instant message delivery using Socket.io.
Global Chat History: All messages are stored in MongoDB and loaded upon login.
Online User Tracking: Real-time count of unique online users.
JWT Authentication: Secure login and registration.
Admin Dashboard:
Real-time statistics (Total Users & Total Messages).
Member Directory (View all registered users).
Promotion System: Admins can promote regular users to Admin status.
Responsive UI: Optimized for Mobile and Desktop using Tailwind CSS v4.
🛠️ Backend Setup (Node.js & Express)
1. Prerequisites
Node.js (v16+)
MongoDB (Local or Atlas)
2. Environment Variables
Create a .env file in the root of your backend folder:
code
Env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
3. Installation
code
Bash
# Navigate to backend folder
npm install

# Start the server
npm start

# Start with nodemon (development)
npm run dev
4. API Endpoints
Method	Endpoint	Description	Access
POST	/api/auth/register	Create a new account	Public
POST	/api/auth/login	Login to get JWT	Public
PATCH	/api/auth/promote	Promote a user to Admin	Admin Only
GET	/api/chat/messages	Fetch last 100 messages	Logged In
GET	/api/chat/admin/stats	Get total counts	Admin Only
GET	/api/chat/admin/users	Get all users list	Admin Only
💻 Frontend Setup (React & Tailwind v4)
1. Installation
code
Bash
# Navigate to frontend folder
npm install

# Run the app
npm run dev
2. Tailwind v4 Note
This project uses Tailwind CSS v4. Ensure your src/index.css contains:
code
CSS
@import "tailwindcss";
3. Configuration
If your backend is running on a different port than 5000, update the baseURL in src/services/api.js and the socket connection in src/context/SocketContext.jsx.
🔑 Initial Admin Setup
To access the Admin Dashboard for the first time:
Register a new user through the app UI.
Open your MongoDB Database (Compass or Atlas).
Find the user in the users collection.
Manually change the role field from "USER" to "ADMIN".
Refresh the app; you will now see the Admin Panel link in the Navbar.
📂 Project Structure
Backend
controllers/: Logic for Auth and Chat.
models/: Mongoose schemas (User, Message).
routes/: Express route definitions.
middlewares/: JWT verification and Admin protection.
socket/: Socket.io event logic (connection, messaging).
utils/: Standardized response handlers.
Frontend
src/context/: Auth and Socket contexts (Global state).
src/pages/: Chat, Admin, and Auth (Login/Register) screens.
src/components/: Reusable Navbar and UI components.
src/services/: Axios configuration for API calls.
🛡️ Security
Handshake Auth: Socket.io connections require a valid JWT token to establish.
Middleware Protection: Admin routes are protected by an isAdmin check on the server side.
Password Hashing: User passwords are encrypted (using bcrypt in the Auth model).