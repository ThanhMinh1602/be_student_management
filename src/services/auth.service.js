const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const genSalt = promisify(bcrypt.genSalt);
const hash = promisify(bcrypt.hash);
const compare = promisify(bcrypt.compare);
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorCodes = require('../constants/errorCodes');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

async function registerUser({ name, email, password, role }) {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error(ErrorCodes.AUTH.EMAIL_EXISTS);
    err.status = 400;
    throw err;
  }

  const salt = await genSalt(10);
  const hashed = await hash(password, salt);

  const user = new User({ name, email, password: hashed, role });
  await user.save();
  return user;
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email });

  // 1. Kiểm tra user tồn tại
  if (!user) {
    const err = new Error(ErrorCodes.USER.NOT_FOUND);
    err.status = 401;
    throw err;
  }

  // 2. Kiểm tra tài khoản có bị khóa hay không
  // Giả sử bạn dùng trường 'isActive' như trong logic Flutter của bạn
  if (user.isActive === false) {
    const err = new Error(ErrorCodes.AUTH.ACCOUNT_LOCKED);
    err.status = 403; // Forbidden
    throw err;
  }

  // 3. Kiểm tra mật khẩu
  const match = await compare(password, user.password);
  if (!match) {
    const err = new Error(ErrorCodes.AUTH.INVALID_CREDENTIALS);
    err.status = 401;
    throw err;
  }

  // 4. Tạo token và trả về kết quả
  const payload = { id: user._id, role: user.role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return { token, user };
}

async function getUserById(id) {
  return User.findById(id).select('-password');
}

module.exports = {
  registerUser,
  loginUser,
  getUserById,
};
