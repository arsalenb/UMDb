const mongo = require("mongoose");
const Schema = mongo.Schema;

const reviewSchema = new Schema ({
    _id:{
        type: String
    },
    userId: {
        type: Number
    },
    movieId:{
        type: String
    },
    reviewer: {
        type: String
    },
    rating:{
        type: Number
    },
    review_summary:{
        type: String
    },
    review_date:{
        type: Date,
        default: Date.now().toString()
    },
    review_detail:{
        type: String
    },
    title:{
        type: String
    }
});

const Review = mongo.model('review', reviewSchema);

module.exports = Review;