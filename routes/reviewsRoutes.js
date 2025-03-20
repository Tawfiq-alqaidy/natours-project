const express = require('express');
const reviewsControler = require("../controllers/reviewsControler");
const authConroler = require("../controllers/authController");

const reviewRouter = express.Router({mergeParams : true});

// protact all routs after this middle ware 
reviewRouter.use(authConroler.protact);

reviewRouter.route('/')
.get( reviewsControler.getAllReviews)
.post(authConroler.restrictTo('user'),reviewsControler.createReview);

reviewRouter.route('/:id')
.delete( authConroler.restrictTo('adim' , 'user'),reviewsControler.deleteReview)
.get(reviewsControler.getReview)
.patch(authConroler.restrictTo("user"),reviewsControler.updateReview);



module.exports = reviewRouter;
