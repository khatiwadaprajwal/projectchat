import jwt from 'jsonwebtoken';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import User from '../models/User.js';


export const isLoggedIn = catchAsync(async (req, res, next) => {
  let token;
  

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }


  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return next(new AppError('Invalid or expired token. Please log in again.', 401));
  }


  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  
  req.user = currentUser;
  next();
});


export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return next(new AppError('Access denied. Admin only.', 403));
  }
  next();
};