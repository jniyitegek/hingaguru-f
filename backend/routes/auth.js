import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();


// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    // Check if user exists
    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await UserModel.create({
      name,
      email,
      passwordHash: hashedPassword,
      phoneNumber,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await UserModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select('-passwordHash');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update user profile (and optionally change password)
// @route   PUT /api/auth/me
// @access  Private
router.put('/me', protect, async (req, res) => {
  try {
    const { name, phoneNumber, languagePreference, currentPassword, newPassword } = req.body ?? {};

    const user = await UserModel.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (typeof name === 'string' && name.trim().length > 0) user.name = name.trim();
    if (typeof phoneNumber === 'string') user.phoneNumber = phoneNumber.trim();
    if (typeof languagePreference === 'string') user.languagePreference = languagePreference;

    // Handle password change if requested
    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ message: 'Current password is required to change password' });
      const match = await bcrypt.compare(currentPassword, user.passwordHash || '');
      if (!match) return res.status(401).json({ message: 'Current password is incorrect' });
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

  const userSafe = user.toObject();
  delete userSafe.passwordHash;

  const changed = [];
  if (typeof name === 'string') changed.push('profile');
  if (newPassword) changed.push('password');

  const message = changed.length === 0 ? 'No changes made' : `Updated: ${changed.join(', ')}`;

  res.json({ message, user: userSafe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

export default router;
