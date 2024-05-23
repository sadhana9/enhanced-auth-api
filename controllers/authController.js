const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validateInput } = require('../utils/validateInput');

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const { errors, isValid } = validateInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ email: 'Email already exists' });
    }

    user = new User({
      name,
      email,
      password,
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      id: user.id,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Log in a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const { errors, isValid } = validateInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ email: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ password: 'Invalid credentials' });
    }

    const payload = {
      id: user.id,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// OAuth callback for Google
const googleAuthCallback = (req, res) => {
  const payload = {
    id: req.user.id,
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: 3600 },
    (err, token) => {
      if (err) throw err;
      res.redirect(`/auth/success?token=${token}`);
    }
  );
};

module.exports = { registerUser, loginUser, googleAuthCallback };

