const { Request, Response, NextFunction } = require('express');
const express = require('express');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const jwt = require('jwt-simple');
const User = require('../model/user');

const secretKey = 'todolist';

//interface CustomRequest extends Request {
//  userId?: string;
//}

// Sign-up controller
exports.signUp = async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  const { email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).send({ errors: [{ msg: 'User already exists' }] });
    }

    // Create a new user
    user = new User({ email, password });

    // Hash the password
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
      .toString('hex');
    user.password = { salt, hash };

    // Save the user in the database
    await user.save();

    // Generate JWT token
    const token = jwt.encode({ userId: user.id }, secretKey);

    return res.status(200).send({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ errors: [{ msg: 'Server error' }] });
  }
};

// Sign-in controller
exports.signIn = async function (req, res) {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(403)
        .send({ errors: [{ msg: 'This user is not found in db' }] });
    }

    // Compare passwords
    const hash = crypto
      .pbkdf2Sync(password, user.password.salt, 1000, 64, 'sha512')
      .toString('hex');
    if (hash !== user.password.hash) {
      return res.status(400).send({ errors: [{ msg: 'Invalid credentials' }] });
    }

    // Generate JWT token
    const token = jwt.encode({ userId: user.id }, secretKey);

    return res.status(200).send({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ errors: [{ msg: 'Server error' }] });
  }
};

// Middleware to check if user is authenticated
exports.requireAuth = function (req, res, next) {
  // Get the JWT token from the request headers or query parameters
  const token = req.headers.authorization?.split(' ')[1] || req.query.token;

  if (!token) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  try {
    // Decode the token
    const decoded = jwt.decode(token, secretKey);

    // Add the decoded user ID to the request object
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error(error);
    return res.status(406).send({ msg: 'Invalid token' });
  }
};
