const express = require('express');
const { getMyProfile, editProfile } = require('../controllers/profileController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/me', protect, getMyProfile);
router.put('/me', protect, editProfile);

module.exports = router;

