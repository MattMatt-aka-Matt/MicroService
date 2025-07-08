const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


const services = {
  auth: 'http://localhost:3001'
};


app.use('/api/auth', createProxyMiddleware({
  target: services.auth,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '/api/auth'
  },
  onError: (err, req, res) => {
    console.error('Erreur proxy:', err.message);
    res.status(500).json({ 
      message: 'Erreur de proxy', 
      error: 'Le microservice d\'authentification n\'est pas disponible' 
    });
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxy: ${req.method} ${req.url} -> ${services.auth}${req.url}`);
  }
}));


app.get('/health', (req, res) => {
  res.json({ 
    status: 'API Gateway opérationnelle',
    services: Object.keys(services),
    timestamp: new Date().toISOString()
  });
});


app.get('/', (req, res) => {
  res.json({
    message: 'API Gateway - Microservices',
    availableServices: Object.keys(services),
    endpoints: [
      'GET /health - Statut de l\'API Gateway',
      'POST /api/auth/register - Inscription',
      'POST /api/auth/login - Connexion'
    ]
  });
});


app.use((err, req, res, next) => {
  console.error('Erreur API Gateway:', err);
  res.status(500).json({ 
    message: 'Erreur interne de l\'API Gateway' 
  });
});

app.listen(PORT, () => {
  console.log(`API Gateway démarrée sur le port ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
});