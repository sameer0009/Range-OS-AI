require('dotenv').config();

module.exports = {
  port: process.env.PORT || 8000,
  logLevel: process.env.LOG_LEVEL || 'info',
  jwtSecret: process.env.SECRET_KEY || 'DEVELOPMENT_SECRET_KEY_CHANGE_IN_PRODUCTION',
  services: {
    identity: process.env.IDENTITY_SERVICE_URL || 'http://localhost:8001',
    lab: process.env.LAB_SERVICE_URL || 'http://localhost:8002',
    policy: process.env.POLICY_SERVICE_URL || 'http://localhost:8003',
  }
};
