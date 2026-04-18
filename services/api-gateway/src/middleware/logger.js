const pino = require('pino');
const { v4: uuidv4 } = require('uuid');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname',
    },
  },
});

const loggerMiddleware = (req, res, next) => {
  const requestId = uuidv4();
  req.id = requestId;
  
  res.setHeader('X-Request-ID', requestId);
  
  logger.info({
    type: 'request',
    method: req.method,
    url: req.url,
    requestId,
  });

  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      type: 'response',
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      requestId,
    });
  });

  next();
};

module.exports = { logger, loggerMiddleware };
