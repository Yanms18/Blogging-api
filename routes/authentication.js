const express = require('express');
const passport = require('../Auth/auth');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Signup Route
router.post('/signup', passport.authenticate('signup', { session: false }), async (req, res, next) => {
  res.json({
    message: 'Signup successful',
    user: req.user
  });
});

// Login Route
router.post('/login', (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err) {
        return next(err);
      }
      if (!user) {
        const error = new Error('Username or password is incorrect');
        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        // Generate JWT token
        const token = jwt.sign(
          { id: user._id }, 
          process.env.JWT_SECRET, 
          { expiresIn: '1h' }
        );

        return res.json({
          message: 'Login successful',
          user: {
            id: user._id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name
          },
          token
        });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

module.exports = router;