const mongo = require("mongoose");

const Schema = mongo.Schema;

const movieSchema = new Schema ({
    budget:{
        type: Number
    },
    cast:{
        type: Array
    },
    genres:{
        type: Array
    },
    _id:{
        type: String,
    },
    overview:{
        type: String
    },
    popularity:{
        type: Number
    },
    poster_path:{
        type: String
    },
    release_date:{
        type: String
    },
    revenue:{
        type: Number
    },
    runtime:{
        type: Number
    },
    spoken_languages:{
        type: Array,
        default: []
    },
    title:{
        type: String
    },
    vote_average:{
        type: Number
    },
    vote_count:{
        type: Number
    },
    reviews:{
        type: Array,
        default: []
    }
});
const Movie = mongo.model('movie', movieSchema);
module.exports ={Movie};