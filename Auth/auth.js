import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'; // Ensure jwt is imported
import connectDB from '../database/db.js'; // Corrected import path

dotenv.config();
connectDB();

// JWT Strategy
const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

passport.use(new JWTStrategy(jwtOptions, async (token, done) => {
  try {
    const user = await User.findById(token.id).select('-password');
    if (!user) return done(null, false);
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

// Signup Strategy
passport.use('signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return done(null, false, { message: 'Email already in use' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      first_name: req.body.first_name,
      last_name: req.body.last_name
    });

    await newUser.save();
    return done(null, newUser);
  } catch (error) {
    return done(error);
  }
}));

// Login Strategy
passport.use('login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password' });
    }

    return done(null, user, { message: 'Logged in successfully' });
  } catch (error) {
    return done(error);
  }
}));

// Add method to generate JWT token
export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }
  );
};

export default passport;
