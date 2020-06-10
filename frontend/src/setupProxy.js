
const proxy = require('http-proxy-middleware').createProxyMiddleware;
module.exports = function(app) {
  app.use(
    '/api',
    proxy({
      target: 'https://import-coding-challenge-api.portchain.com',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
    }),
  );
};