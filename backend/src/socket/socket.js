import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Message from '../models/Message.js';

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"],
    },
  });

  // Maps userId (String) -> socketId (String)
  // This helps us track unique logged-in users, even if they refresh the page.
  const userSocketMap = new Map(); 

  // --- 1. SOCKET AUTHENTICATION MIDDLEWARE ---
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      // Attach user object to the socket session
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid or expired token'));
    }
  });

  // --- 2. SOCKET CONNECTION & EVENT LISTENERS ---
  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    console.log(`New Socket Connection: ${socket.id} (User: ${socket.user.username})`);

    // Map the user ID to their current socket ID
    userSocketMap.set(userId, socket.id);

    // Broadcast the unique count of online users to everyone
    // userSocketMap.size gives us the exact count of unique logged-in users
    io.emit('online_users_count', userSocketMap.size);

    // Handle sending messages
    socket.on('send_message', async (data) => {
      try {
        // 1. Save to DB
        const newMessage = await Message.create({
          senderId: socket.user._id,
          senderName: socket.user.username,
          content: data.content,
        });

        // 2. Broadcast to all connected clients
        io.emit('receive_message', newMessage);

        // 3. Update total messages for Admin view
        const totalMessages = await Message.countDocuments();
        io.emit('admin_total_messages_update', totalMessages);
      } catch (error) {
        socket.emit('error', 'Failed to send message');
        console.log('Socket Error:', error);
      }
    });

    // Handle Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      
      // Only delete from the map if the disconnected socket matches the mapped socket.
      // (This prevents an old tab closing from disconnecting a newly opened tab for the same user)
      if (userSocketMap.get(userId) === socket.id) {
        userSocketMap.delete(userId);
      }

      // Broadcast updated online users count
      io.emit('online_users_count', userSocketMap.size);
    });
  });

  return io;
};