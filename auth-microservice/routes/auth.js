const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const router = express.Router();

const JWT_SECRET = 'votre-secret-jwt-très-sécurisé';


router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Utilisateur déjà existant' 
      });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});


router.post('/login', async (req, res) => {
  console.log('Requête login reçue');
  console.log('Body:', req.body);
  
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email et mot de passe requis' 
      });
    }

    console.log('Recherche utilisateur avec email:', email);
    

    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      return res.status(400).json({ 
        message: 'Identifiants invalides' 
      });
    }

    console.log('Utilisateur trouvé, vérification mot de passe...');
    

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Mot de passe incorrect');
      return res.status(400).json({ 
        message: 'Identifiants invalides' 
      });
    }

    console.log('Mot de passe correct, création du token...');
    

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Token créé, envoi de la réponse');
    
    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ Erreur dans login:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;