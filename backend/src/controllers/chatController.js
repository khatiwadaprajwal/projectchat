import Message from '../models/Message.js';
import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import { successResponse } from '../utils/responseHandler.js';


export const getChatHistory = catchAsync(async (req, res, next) => {

  const messages = await Message.find().sort({ createdAt: 1 }).limit(100);
  
  return successResponse(res, 200, 'Messages fetched successfully', messages);
});

// Admin ONLY: Get total registered users and total messages
export const getAdminStats = catchAsync(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const totalMessages = await Message.countDocuments();

  const responseData = {
    totalUsers,
    totalMessages
  };

  return successResponse(res, 200, 'Admin statistics fetched successfully', responseData);
});

export const getAllUsers = catchAsync(async (req, res, next) => {
  
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  
  return successResponse(res, 200, 'Users fetched successfully', users);
});