require('dotenv').config();
const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

app.use('/api/auth', proxy(process.env.AUTH_SERVICE_URL, {
  proxyReqPathResolver: function(req) {
    return '/api/auth' + req.url;
  },
  proxyReqOptDecorator: function(proxyReqOpts, srcReq) {

    if (srcReq.headers.authorization) {
      proxyReqOpts.headers['Authorization'] = srcReq.headers.authorization;
    }
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    return proxyReqOpts;
  },
  userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
    try {
      return proxyResData;
    } catch (error) {
      console.error('Proxy error:', error);
      return { message: 'Auth service unavailable' };
    }
  }
}));

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API Gateway is running',
    timestamp: new Date().toISOString()
  });
});

// Route principale
app.get('/', (req, res) => {
  res.json({
    message: 'API Gateway - Microservices (with express-http-proxy)',
    endpoints: [
      'POST /api/auth/register - User registration',
      'POST /api/auth/login - User login',
      'GET /api/auth/profile - User profile (protected)',
      'GET /api/test - Test endpoint'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT} with express-http-proxy`);
});
