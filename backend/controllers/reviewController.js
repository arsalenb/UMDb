const mongoDriver = require("../Mongo");
const Review = require("../models/review");
const PORT = require("../../backend/index.js")

// @desc    Method to retrieve a SINGLE review embedded in a "Movie" document
// @route   NONE: called internally

async function getReviewEmbedded(id, movieId){
    try {
        let elt_to_return =[]
        // Connect to the MongoDB cluster
        let db = await mongoDriver.mongo();
        let movie = await db.collection("movies").findOne({_id: movieId})
        movie['reviews'].forEach( x => {
            if (x._id === id){
                elt_to_return = [x, movie['reviews'].indexOf(x)]
            }
        })
        return elt_to_return
    } catch (e) {
        throw(e);
    }
}

// @desc    Method to retrieve a review in the MongoDB "review" collection
// @route   NONE: called internally

async function getReview(id){
    try {
        // Connect to the MongoDB cluster
        let db = await mongoDriver.mongo();
        return await db.collection("reviews").findOne({_id: id})
    } catch (e) {
        throw(e);
    }
}

// @desc    Get ALL reviews embedded in a "Movie" document
// @route   GET /api/review/:id
// @access  User

const findReviewsOfMovie = async (req, res) => {
    const movieId = req.params.id;
    if (!movieId)
        return res.status(400).json({ message: "Movie ID Missing." });
    try {
        // Connect to the MongoDB cluster
        let db = await mongoDriver.mongo();
        let movie = await db.collection("movies").findOne({_id: movieId});
        const reviews = movie["reviews"]
        res.status(200).json({ reviews: reviews, message: "Task executed successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Get MORE reviews of a movie from the mongoDB "reviews" collection
// @route   GET /api/review/more/:id
// @access  User

const getMoreReviewsOfMovie = async (req, res) => {
    const movieId = req.params.id;
    if (!movieId)
        return res.status(400).json({ message: "Movie ID Missing." });
    try {
        // Connect to the MongoDB cluster
        let db = await mongoDriver.mongo();
        let reviews = await db.collection("reviews").aggregate([
            {$match: {movieId: movieId}},
            {$project: {
                    date :{$toDate: "$review_date"},
                    movieId:1,
                    title:1,
                    reviewer:1,
                    rating:1,
                    review_detail:1,
                    review_summary:1,
            }},
            {$sort: {date:-1}}
        ]).skip(20).toArray()
        res.status(200).json({reviews: reviews, message: "Task executed successfully"});
    }catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Method to update the "average_vote" and "vote_count" of movie after CREATING a review
// @route   NONE: called internally

async function updateMovieRatingCreation (movie, rating) {
    try{
        let newAvgRating = ((movie["vote_average"] * movie["vote_count"])+ rating)/ (movie["vote_count"] +1);
        let newNumVotes = (movie["vote_count"] +1);
        let update = {vote_average: newAvgRating.toFixed(1), vote_count: newNumVotes};
        let db = await mongoDriver.mongo();
        return upd_movie = await db.collection("movies").updateOne({_id: movie["_id"]}, {$set: update});
    } catch (e) {
        throw(e);
    }
}

// @desc    Method to update the "average_vote" and "vote_count" of movie after EDITING a review
// @route   NONE: called internally

async function updateMovieRatingEditing (movie, oldRating, newRating) {
    try{
        let db = await mongoDriver.mongo();
        let newAvgRating = (((movie["vote_average"] * movie["vote_count"])- parseInt(oldRating)) + parseInt(newRating))/ (movie["vote_count"]);
        let updateNew = {vote_average: newAvgRating.toFixed(1)};
        await db.collection("movies").updateOne({_id: movie["_id"]}, {$set: updateNew});
    } catch (e) {
        throw(e);
    }
}

// @desc    Method to update the "average_vote" and "vote_count" of movie after DELETING a review
// @route   NONE: called internally

async function updateMovieRatingDeleting (movie, oldRating, delRating) {
    try{
        let db = await mongoDriver.mongo();
        let newAvgRating = ((oldRating * movie["vote_count"])- delRating)/ (movie["vote_count"]-1);
        let newNumVotes = (movie["vote_count"] -1);
        if (isNaN(newAvgRating)) { newAvgRating =0}
        let update = {vote_average: newAvgRating.toFixed(1), vote_count: newNumVotes};
        await db.collection("movies").updateOne({_id: movie["_id"]}, {$set: update});
    } catch (e) {
        throw(e);
    }
}

// @desc    Create a review document in the MongoDb "reviews" collection
// @route   POST /api/review/crtrev
// @access  User

const createReview = async (req, res) => {
    const {userId, username, movieId, title, rating, review_summary, review_detail} = req.body;
    if (userId==null || username==null || movieId==null || title==null || rating==null || review_summary==null || review_detail==null)
        return res.status(400).json({ message: "Review Info Missing." });
    try{
        let db = await mongoDriver.mongo();
        let tot = await db.collection("reviews").count() + 15704481 + Math.floor(Math.random() * 10000) + Math.floor(Math.random() * 10000);
        let newReview = new Review({
            _id: "rw" + tot,
            userId: userId,
            reviewer: username,
            movieId: movieId,
            rating: rating,
            title: title,
            review_summary: review_summary,
            review_detail: review_detail,
        })
        let movie = await db.collection("movies").findOne({_id: movieId})
        if ((movie['reviews']).length >= 20){
            movie['reviews'].push(newReview)
            movie['reviews'].shift()
        } else{
            movie['reviews'].push(newReview)
        }
        await db.collection("movies").replaceOne({_id: movieId}, movie)
        await db.collection("reviews").insertOne(newReview)
        await updateMovieRatingCreation(movie, newReview["rating"])
        res.status(200).json({ review: newReview, message: "Review Added successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Edit a review document in the MongoDb "reviews" collection
// @route   PUT /api/review/upd
// @access  User

const editReview = async (req, res) => {
    const userId = 5;
    const {review_id, movieId, new_rating, new_review_summary, new_review_detail} = req.body;
    if (!review_id || !userId || !movieId || !new_rating || !new_review_summary || !new_review_detail)
        return res.status(400).json({ message: "Review Edit Info Missing." });
    try{
        let db = await mongoDriver.mongo();
        let editedReview = new Review({
            rating: new_rating,
            review_summary: new_review_summary,
            review_detail: new_review_detail,
        })

        let movie = await db.collection("movies").findOne({_id: movieId})
        let oldRating = movie["vote_average"]

        let status = await db.collection("reviews").updateOne({_id: review_id}, editedReview)

        if (status["modifiedCount"]===0){
            throw Error("Review Not Found!")
        }else {
            let emb_rev = await getReviewEmbedded(review_id, movieId)
            if (emb_rev != null) {
                let review_to_update = movie["reviews"][emb_rev[1]]
                review_to_update["review_summary"] = new_review_summary
                review_to_update["review_detail"] = new_review_detail
                review_to_update["rating"] = new_rating
                await db.collection("movies").replaceOne({_id: movieId}, movie)
            }
        }

        await updateMovieRatingEditing(movie, oldRating, new_rating)

        res.status(200).json({ message: "Review Edited successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Delete a review document from the MongoDb "reviews" collection
// @route   DELETE /api/review/dltrev
// @access  User

const deleteReview = async (req, res) => {
    const url = new URL(`http:/localhost:${PORT}/`+ req.url)
    const review_id = url.searchParams.get("review_id");
    const movieId = url.searchParams.get('movieId')

    if (review_id==null || movieId==null)
        return res.status(400).json({ message: "Review Info Missing." });

    try{
        let db = await mongoDriver.mongo();
        let review_to_delete = await db.collection("reviews").findOne({_id: review_id});
        let movie = await db.collection("movies").findOne({_id: movieId});
        let oldVoteAverage = movie["vote_average"]
        if (review_to_delete != null){
            await db.collection("reviews").deleteOne(review_to_delete)
            let x = await getReviewEmbedded(review_id, movieId)
            if (x!=null) {
                movie['reviews'].splice(x[1], 1)
                await db.collection("movies").replaceOne({_id: movieId}, movie)
            }
            let delRating = review_to_delete["rating"]
            await updateMovieRatingDeleting(movie, oldVoteAverage, delRating)
        } else{

        }
        res.status(200).json({ message: "Review Deleted successfully" });
    } catch (e) {
        throw(e);
    }
}

// @desc    Get the total reviews posted per year
// @route   GET /api/review/totalrev/year
// @access  User

const totalReviewsPerYear = async (req, res) => {
    try {
        // Connect to the MongoDB cluster
        let db = await mongoDriver.mongo();
        const reviews = await db.collection("reviews").aggregate([
            {$project: {
                    date :{$toDate: "$review_date"},
            }},
            {$project: {
                    year: {$year: "$date"}
            }},
            {$group:{
                    _id: "$year",
                    review_per_year: {
                        $sum: 1
                    }
            }},
            {$sort: {_id:-1}}
        ]).toArray()
        res.status(200).json({reviews: reviews, message: "Task executed successfully"});
    }catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Get the distribution of the rating scores per movie
// @route   GET /api/review/ratings/:id
// @access  User

const ratingsPerMovie = async (req, res) => {
    const movieId = req.params.id;
    if (!movieId)
        return res.status(400).json({ message: "Movie ID Missing." });
    try {
        // Connect to the MongoDB cluster
        let db = await mongoDriver.mongo();
        const reviews = await db.collection("reviews").aggregate([
            {$match: {movieId: movieId}},
            {$group:{
                _id: "$rating",
                rating_count: {
                    $sum: 1
                }
            }},
            {$sort: {_id:-1}}
        ]).toArray()
        res.status(200).json({reviews: reviews, message: "Task executed successfully"});
    }catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    getReview,
    createReview,
    deleteReview,
    editReview,
    findReviewsOfMovie,
    getMoreReviewsOfMovie,
    totalReviewsPerYear,
    ratingsPerMovie
};

