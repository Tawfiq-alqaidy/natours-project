const mongoos = require('mongoose');

// review // rating // createdAt //ref tour // ref user
const reviewSchema = new mongoos.Schema({
    review :{
        type:String,
        required:[true,"review cat not by empty"]
    },
    rating:{
        type:Number,
        min : [1,"the rating must be above or equal 1"],
        max : [5 , "the rating must be below or equal 5.0"]
    },

    createdAt:{
        type: Date,
        defult:Date.now()
    },

    tour:{
        type: mongoos.Schema.ObjectId,
        ref:'Tour',
        required:[true , "Review must belong to a tour"]
    } ,

    user:{
        type: mongoos.Schema.ObjectId,
        ref:'User',
        required:[true , "Review must belong to a user"]
    },
    
},
{
    
    toJSON:{virtuals:true } ,
    toObject:{virtuals:true },
    
}
);


reviewSchema.pre('save', function(next){
    this.createdAt = Date.now();
    next();
})

reviewSchema.pre(/^find/ , function(next){
    this.populate({
        path:'user',
        select:'name photo -_id'
    })
    next();
})



reviewSchema.statics.calcAvregeRating = async function(tourId){
    const statistic = await this.aggregate([
        {
            $match: {tour : tourId}
        },
        {
            $group:{
                _id:'$tour',
                nRating: {$sum : 1},
                avgRating: {$avg : '$rating' }
            }
        }
    ]);
    
    
    await mongoos.model('Tour').findOneAndUpdate(
        { _id: tourId },
        {
            ratingsQuantity: statistic[0]?.nRating || 0 ,
            ratingsAverage: statistic[0]?.avgRating || 4.5  // قيمة افتراضية عند عدم وجود تقييمات
        },
        { new: true, runValidators: true } // خيارات إضافية
    );
    
}

reviewSchema.post('save' , function(){
    // this points to the currnet review
    this.constructor.calcAvregeRaring(this.tour);
})

// findOneasndUpdate
// findOneAndDelete
reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.rev = await this.findOne(); //Find the document and store it in this.rev
    console.log(this.rev)
    next();
});

reviewSchema.post(/^findOneAnd/, async function(doc) {
// Use the document retrieved from the previous operation
    if (doc) {
        await doc.constructor.calcAvregeRaring(doc.tour);
    }
});


const reviews = mongoos.model('reviews',reviewSchema);


module.exports = reviews;