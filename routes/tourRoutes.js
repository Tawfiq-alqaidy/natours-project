const express = require('express');  
// 1)IMPORT TOUR CONTROLLER
const tourController = require('./../controllers/toursControllers');

// import aouthController 

const authController  = require('../controllers/authController');

const reviewsRoutes = require('../routes/reviewsRoutes');
// 2) Make the tourRouter 
const tourRouter = express.Router();


tourRouter.use('/:tourId/reviews' , reviewsRoutes);

// 3) Tour Routes

tourRouter.route('/tour-statistic')
.get(tourController.getStatisticTours);

tourRouter.route('/monthly-plan/:year')
.get(tourController.aliasTopTours,tourController.getMonthlyPlan);



tourRouter.route('/')
.get(tourController.getAllTours)

// protact all routs after this middle ware 
tourRouter.use(authController.protact);

tourRouter.route('/top-5-cheap')
.get( tourController.getAllTours);

// /tours-within?distance=233&center=-40,45&45unit=mi
// /tours-within/233/center/-40,45/unit/mi
tourRouter.route('/tours-within/:distance/center/:latlng/unit/:unit')
.get(tourController.getTourWthitin);

tourRouter.route('/distances/:latlng/unit/:unit')
.get(tourController.getDistances);

tourRouter.route('/')
.post(authController.restrictTo('admin' , 'guide' , 'lead-guide'),tourController.creatTour);

tourRouter.route('/:id')
.get(tourController.getTour)
.patch(authController.restrictTo("admin" , "lead-guide") , tourController.updateTourInfo)
.delete(authController.restrictTo("admin","lead-guide"),tourController.deleteTour);


// 4) Export the rout
module.exports = tourRouter;
