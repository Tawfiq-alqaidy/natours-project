

// IMPORT TOUR MODEL 
const Tour = require('../models/tourModel');


//IMPORT CATCH ASYNC HUNDLER!!!!
const catchAsync = require('../utils/catchAsync');
const AppErrore = require('../utils/appErrore');
const Factory = require('./handlerFactory');

// cheap 5 tours middlware 
exports.aliasTopTours = (req , res , next) =>{
    req.query.sort = 'price,-ratingsAverage';
    req.query.limit = '5';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}


// MAKE THE TOUR HANDLLERS AND EXPORT THEM

exports.getAllTours = Factory.getAll(Tour)
exports.getTour = Factory.getOne(Tour , {path : 'Reviews'})



exports.getStatisticTours = catchAsync( async(req,res , next) =>{
    const statistic = await Tour.aggregate([
    {
        $match: {ratingsAverage: { $gte: 4.5 }}
    },
    {
        $group:{
            _id:{ $toUpper : '$difficulty'},
            numTours: {$sum : 1},
            numRatings:{$sum : '$ratingsQuantity'},
            avgRating :{ $avg : '$ratingsAverage' },
            avgPrice: { $avg : '$price'},
            minPrice: { $min : '$price'},
            maxPrice: { $max : '$price'}
        }
    },
    {
        $sort:{ avgPrice : 1 }
    },
    // {
    //     $match : { _id : {$ne: 'EASY'}}
    // }
]);
res.status(200).json({
    status:'Success',
    data:{
        The_Statistic : statistic,
    }
})
})

exports.getMonthlyPlan = catchAsync(async (req , res , next) =>{

    const year = Number(req.params.year); // 2021
    const paln = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match:{                    
                startDates:
                {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                }
            }
        },
        {
            $group:
            {
                _id: {$month: '$startDates'},
                numOfTourStart: { $sum : 1 },
                tours: {$push : '$name'}
            }
        },
        {
            $addFields: { month : '$_id' }
        },
        {
            $project: { _id : 0 }
        },
        {
            $sort: {  numOfTourStart: -1 }
        }

    ])
    res.status(200).json({
        status: 'Success',
        data:{
            The_paln : paln
        }
    })
})


// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/-40,45/unit/mi

exports.getTourWthitin = catchAsync(async (req, res , next) =>{
    const {distance , latlng , unit} = req.params;
    const [lat , lng] = latlng.split(',');
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if(!lat || !lng){
        next(new AppErrore('please privide the latitur and langitude in format lat,lang', 400));
    }


    const Tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    // console.log(req.params);
    res.status(200).json({
        status:"success",
        length: Tours.length,
        data:{
            data : Tours
        }
    });
})


exports.getDistances = catchAsync(async(req, res , next) =>{
    const {latlng , unit} = req.params;
    const [lat , lng] = latlng.split(',');

    if(!lat || !lng){
        next(new AppErrore('please privide the latitur and langitude in format lat,lang', 400));
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [Number(lng), Number(lat)]
                },
                distanceField: 'distance',
                distanceMultiplier: unit === 'mi' ? 0.000621371 : 0.001
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }   
    ])

    res.status(200).json({
        status:"success",
        data:{
            data : distances
        }
    });
})
//create tour
exports.creatTour = Factory.createOne(Tour);
// update tour
exports.updateTourInfo = Factory.updateOne(Tour);
// delete tour
exports.deleteTour = Factory.deleteOne(Tour);

