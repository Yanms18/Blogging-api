const passport = require('passport');
const jwt = require('jsonwebtoken');

// Signup Controller
const signup = async (req, res, next) => {
  passport.authenticate('signup', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ message: info.message });
    }
    res.status(201).json({
      message: 'Signup successful',
      user: {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      }
    });
  })(req, res, next);
};

// Signin Controller
const signin = (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json({ message: 'Username or password is incorrect' });
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
};

module.exports = {
  signup,
  signin
};