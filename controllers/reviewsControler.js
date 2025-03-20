const reviews = require('../models/reviewsModel');
const Tour = require('../models/tourModel');


//IMPORT CATCH ASYNC HUNDLER!!!!
const catchAsync = require('../utils/catchAsync');

const Factory = require('./handlerFactory');

exports.createReview = catchAsync(async (req, res, next) => {
// Ensure that the values ​​of tour and user are present in body
    req.body.tour = req.body.tour || req.params.tourId;
    req.body.user = req.body.user || req.user.id;

// Create the review using the submitted data
    const rev = await reviews.create(req.body);

    // Update the Tour model by adding the review ID to the reviews array.
    await Tour.findByIdAndUpdate(req.body.tour, {
        $push: { reviews: rev._id }
    });

    // Submit a response with the created review.
    res.status(201).json({
        status: "success",
        data: {
            rev
        }
    });
});

// get all reviews
exports.getAllReviews = Factory.getAll(reviews)

// delete review
exports.deleteReview = Factory.deleteOne(reviews);
//update review
exports.updateReview = Factory.updateOne(reviews);
// get reveiw 
exports.getReview = Factory.getOne(reviews)