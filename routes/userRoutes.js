const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /users - Créer un nouvel utilisateur
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    console.error(`Error creating user: ${err.message}`);
    res.status(400).send(err.message);
  }
});

// GET /users/all - Afficher tous les utilisateurs
router.get('/all', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    console.error(`Error fetching users: ${err.message}`);
    res.status(400).send(err.message);
  }
});

module.exports = router;
