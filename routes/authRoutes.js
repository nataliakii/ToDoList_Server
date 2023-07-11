const { Router } = require('express');
const { check } = require('express-validator');
const {
  signUp,
  signIn,
  requireAuth,
} = require( '../controllers/authController' );
const private=require('../controllers/private')

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
router.get( '/tasks/:userId', requireAuth, private.fetchTasks );
router.post( '/addtask', requireAuth, private.addTask );
router.delete( '/tasks/:taskId', requireAuth, private.deleteTask );
router.put( '/tasks/:taskId', requireAuth, private.editTask );
router.patch( '/tasks/:taskId', requireAuth, private.toggleDone );
//router.get('/pics',requireAuth, private.pics);


module.exports = router;
