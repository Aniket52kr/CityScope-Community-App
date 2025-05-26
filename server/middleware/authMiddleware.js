import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token = null;

  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
    console.log('[Auth] Token found in cookies');
  } else if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('[Auth] Token found in headers:', token);
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, malformed auth header' });
    }
  }

  if (!token) {
    console.warn('[Auth] No token found in cookies or headers');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[Auth] Decoded JWT:', decoded);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.warn('[Auth] User not found:', decoded.id);
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;  // <-- make sure this is set correctly
    next();
  } catch (error) {
    console.error(`[Auth] Token verification failed: ${error.message}`);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token', error: error.message });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export { protect };
