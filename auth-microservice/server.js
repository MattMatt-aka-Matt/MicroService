const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());


connectDB();


app.use('/api/auth', authRoutes);


app.get('/api/protected', require('./middleware/auth'), (req, res) => {
  res.json({ message: 'Accès autorisé', user: req.user });
});

app.listen(PORT, () => {
  console.log(`Microservice d'authentification sur le port ${PORT}`);
});


app.post('/api/test', (req, res) => {
  console.log('📝 Test route - Body reçu:', req.body);
  res.json({ 
    message: 'Test OK', 
    received: req.body,
    timestamp: new Date().toISOString()
  });
});