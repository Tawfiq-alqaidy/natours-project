const express = require('express');
const Router = express.Router();
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const { router } = require('../app');

// Apply isLoggedin middleware to all routes
// Router.use(authController.isLoggedin);

Router.get('/', authController.isLoggedin, viewsController.overview);
Router.get('/tour/:slug', authController.isLoggedin, viewsController.getTour);
Router.get('/login', authController.isLoggedin, viewsController.getLoginForm);
Router.get('/signup', authController.isLoggedin, viewsController.getSingupForm);
Router.get('/favicon.ico', (req, res) => res.status(204));
Router.get('/me', authController.protact, viewsController.getAcountSettings);
Router.post(
  '/submit-user-data',
  authController.protact,
  viewsController.updateUserData
);
module.exports = Router;
