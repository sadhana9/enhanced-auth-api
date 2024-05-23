const express = require('express');
const { registerUser, loginUser, googleAuth, googleAuthCallback } = require('../controllers/authController');
const passport = require('passport');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), googleAuthCallback);

module.exports = router;
