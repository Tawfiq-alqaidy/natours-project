const express = require('express');

// 1) IMPORT USERS CONTROLLER
const userController = require('./../controllers/usersControllers');

// IMPORT THE authController
const authController = require('../controllers/authController');

const multer = require('multer');
const upload = multer({ dest: 'public/img/users' });

// 2) Make the userRouter
const usersRouter = express.Router();

// make the signup route
usersRouter.post('/signup', authController.signup);
// make the login route
usersRouter.post('/login', authController.login);
// make the logout route
usersRouter.get('/logout', authController.logout);
// make the forgot Password route
usersRouter.post('/forgotPassword', authController.forgotPassword);
// make the reset Password route
usersRouter.patch('/resetPassword/:token', authController.resetPassword);

// protact all routs after this middle ware
usersRouter.use(authController.protact);

usersRouter.patch('/UpdatePassword', authController.UpdatePassword);

usersRouter.get('/Me', userController.getMe, userController.getUser);
usersRouter.patch('/updateMe', upload.single('photo'), userController.updateMe);
usersRouter.delete('/deleteMe', userController.deleteMe);

// make all routs after this middleware just for admin
usersRouter.use(authController.restrictTo('admin'));

usersRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUsers);

usersRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

// 4)  Export the rout
module.exports = usersRouter;
