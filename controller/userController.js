const User = require('../models/User');

// Get user details
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const newUser = new User({
      first_name,
      last_name,
      email,
      password
    });

    const result = await newUser.save();
    res.status(201).json({
			success: true,
			message: 'Your account has been created successfully',
			result,
		});
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Update user details
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, password } = req.body;

    let user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (email) user.email = email;
    if (password) user.password = password;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.deleteOne({ _id: id });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = {
  getUser,
  createUser,
  updateUser,
  deleteUser
};