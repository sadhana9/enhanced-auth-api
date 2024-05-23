const User = require('../models/User');

// Get logged-in user's profile
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Edit logged-in user's profile
const editProfile = async (req, res) => {
  const { name, email, bio, phone, isPublic } = req.body;
  const userFields = { name, email, bio, phone, isPublic };

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { getMyProfile, editProfile };

