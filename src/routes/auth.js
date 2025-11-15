const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'There was a server error.. sorry!' });
  }
})


module.exports = router;
