const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('./config');
const { logger, loggerMiddleware } = require('./middleware/logger');
const authMiddleware = require('./middleware/auth');

const app = express();

// Global Middlewares
app.use(loggerMiddleware);

// Health Check (Public)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'api-gateway',
    request_id: req.id 
  });
});

// Proxy Rules Configuration
const proxyOptions = {
  changeOrigin: true,
  pathRewrite: {
    '^/api/v1/auth': '/api/v1/auth',
    '^/api/v1/labs': '/api/v1/labs',
    '^/api/v1/policies': '/api/v1/policies',
  },
  onError: (err, req, res) => {
    logger.error({ type: 'proxy_error', error: err.message, requestId: req.id });
    res.status(502).json({
      error: 'Upstream Service Unavailable',
      code: 502,
      request_id: req.id
    });
  }
};

// 1. Identity Service (Auth)
// Note: Login/Registration is usually public
app.use('/api/v1/auth', createProxyMiddleware({
  ...proxyOptions,
  target: config.services.identity
}));

// 2. Lab Service (Protected)
app.use('/api/v1/labs', authMiddleware, createProxyMiddleware({
  ...proxyOptions,
  target: config.services.lab
}));

// 3. Policy Service (Protected)
app.use('/api/v1/policies', authMiddleware, createProxyMiddleware({
  ...proxyOptions,
  target: config.services.policy
}));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route Not Found',
    code: 404,
    request_id: req.id
  });
});

// Start Gateway
app.listen(config.port, () => {
  logger.info(`RangeOS API Gateway initialized on port ${config.port}`);
  logger.info(`-> Identity Service: ${config.services.identity}`);
  logger.info(`-> Lab Service:      ${config.services.lab}`);
  logger.info(`-> Policy Service:   ${config.services.policy}`);
});
