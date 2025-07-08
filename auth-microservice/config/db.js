const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Tentative de connexion à MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/auth-microservice');
    console.log('MongoDB connecté avec succès');
  } catch (error) {
    console.error('Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;