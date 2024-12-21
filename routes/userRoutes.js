const express = require('express');
const { getUser, createUser, updateUser, deleteUser } = require('../controller/userController');
const passport = require('../Auth/auth');

const router = express.Router();

// Endpoint to get user details 
router.get('/:id', getUser);

// Endpoint to create a new user
router.post('/', createUser);

// Endpoint to update user details (requires authentication)
router.put('/:id', passport.authenticate('jwt', { session: false }), updateUser);

// Endpoint to delete a user (requires authentication)
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteUser);

module.exports = router;