require('dotenv').config();
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


app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Auth microservice is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Auth microservice running on port ${PORT}`);
});
