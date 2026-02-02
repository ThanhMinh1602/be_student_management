const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const genSalt = promisify(bcrypt.genSalt);
const hash = promisify(bcrypt.hash);
const compare = promisify(bcrypt.compare);
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const MessageCodes = require('../constants/messageCodes');
const UserResource = require('../resources/user.resource');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

const REFRESH_SECRET = process.env.REFRESH_SECRET || 'changeme_refresh_secret';
const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN || '7d';

async function registerUser({ name, username, password, role }) {
  const existing = await User.findOne({ username });
  if (existing) {
    const err = new Error(MessageCodes.AUTH.EMAIL_EXISTS);
    err.status = 400;
    throw err;
  }

  const salt = await genSalt(10);
  const hashed = await hash(password, salt);

  const user = new User({ name, username, password: hashed, role });
  await user.save();
  return UserResource.single(user);
}

async function loginUser({ username, password }) {
  const user = await User.findOne({ username });

  if (!user) {
    const err = new Error(MessageCodes.USER.NOT_FOUND);
    err.status = 401;
    throw err;
  }

  if (user.isActive === false) {
    const err = new Error(MessageCodes.AUTH.ACCOUNT_LOCKED);
    err.status = 403;
    throw err;
  }

  const match = await compare(password, user.password);
  if (!match) {
    const err = new Error(MessageCodes.AUTH.INVALID_CREDENTIALS);
    err.status = 401;
    throw err;
  }

  const tokens = generateTokens(user);
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: UserResource.single(user),
  };
}

async function refreshAccessToken(token) {
  try {
    const payload = jwt.verify(token, REFRESH_SECRET);
    const user = await User.findById(payload.id);

    if (!user || user.isActive === false) {
      const err = new Error(MessageCodes.AUTH.ACCOUNT_LOCKED);
      err.status = 403;
      throw err;
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    return accessToken;
  } catch (err) {
    const error = new Error(MessageCodes.AUTH.REFRESH_TOKEN_INVALID);
    error.status = 401;
    throw error;
  }
}
async function getUserById(id) {
  const user = await User.findById(id);
  return UserResource.single(user);
}
function generateTokens(user) {
  const payload = { id: user._id, role: user.role };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
}
module.exports = {
  registerUser,
  loginUser,
  getUserById,
  refreshAccessToken,
};
