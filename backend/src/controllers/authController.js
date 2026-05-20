import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import { successResponse } from '../utils/responseHandler.js';

// Helper function to generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    return next(new AppError('User with this email or username already exists', 400));
  }


  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);


  const user = await User.create({ username, email, password: hashedPassword });

  if (!user) {
    return next(new AppError('Failed to create user', 400));
  }

 
  const responseData = {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  };

  return successResponse(res, 201, 'User registered successfully', responseData);
});


export const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;


  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid email or password', 401));
  }

 
  const responseData = {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  };

  return successResponse(res, 200, 'Login successful', responseData);
});



export const promoteToAdmin = catchAsync(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    return next(new AppError('Please provide a user ID', 400));
  }

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (user.role === 'ADMIN') {
    return next(new AppError('User is already an admin', 400));
  }

  user.role = 'ADMIN';
  await user.save();

  return successResponse(res, 200, `${user.username} has been promoted to Admin successfully`, user);
});