const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();


router.post('/register', authController.register);
router.post('/login', authController.login);


router.get('/profile', authMiddleware, (req, res) => {
  res.json({ 
    message: 'Access granted', 
    user: req.user 
  });
});

module.exports = router;
