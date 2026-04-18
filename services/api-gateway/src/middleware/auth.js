const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');
const { logger } = require('./logger');

const authMiddleware = (req, res, next) => {
  // Public routes (Auth service) bypass
  if (req.path.startsWith('/api/v1/auth/login')) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn({ type: 'auth_failure', path: req.path, reason: 'missing_token' });
    return res.status(401).json({
      error: 'Authentication Required',
      code: 401,
      request_id: req.id
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    logger.error({ type: 'auth_failure', path: req.path, reason: 'invalid_token', error: err.message });
    return res.status(403).json({
      error: 'Invalid or Expired Token',
      code: 403,
      request_id: req.id
    });
  }
};

module.exports = authMiddleware;
