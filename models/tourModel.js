const mongoose=require('mongoose');
//schema
const tourSchema= new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'], //validator
        unique: true,
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration'], //validator
    },
    // rating: Number,
    maxGroupSize: {
        type: String,
        required: [true, 'A tour must have a group size'], //validator
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: Number,
    summary: {
        type: String,
        required: [true, 'A tour must have a summary'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date]
});

const Tour = mongoose.model('Tour',tourSchema);

module.exports = Tour;
//document out of Tour model
// const testTour= new Tour({
//     name: 'The Park Camper',
//     rating: 4.7,
//     price: 597
// });
// testTour
//     .save()
//     .then(doc=>{console.log(doc)})
//     .catch(err=>console.log(err));
