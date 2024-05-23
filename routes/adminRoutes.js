const express = require('express');
const { getAllProfiles, getUserProfile } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/profiles', protect, admin, getAllProfiles);
router.get('/profiles/:id', protect, admin, getUserProfile);

module.exports = router;

