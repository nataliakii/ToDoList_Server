const { Router } = require('express');
const { check } = require('express-validator');
const {
  signUp,
  signIn,
  requireAuth,
} = require('../controllers/authController');

const router = Router();

router.post(
  '/signup',
  [
    check('email').isEmail().withMessage('Invalid email'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  signUp,
);

router.post(
  '/signin',
  [
    check('email').isEmail().withMessage('Invalid email'),
    check('password').notEmpty().withMessage('Password is required'),
  ],
  signIn,
);

router.get('/private', requireAuth, (req, res) => {
  res.send('You are authorized to access this private path');
});

router.get('/notprivate', (req, res) => {
  console.log(req.params);
  res.send(
    'You are not authorized to access this private path but its not private',
  );
});

module.exports = router;
