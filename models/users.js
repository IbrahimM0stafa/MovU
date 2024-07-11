const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userschema = new Schema({
    UserName:{
        type:String ,
        required:true
    },
    Age:{
        type:Number,
        required:true
    },
    Gender:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    watchlist: {
        type: [String],  
        default: []
    },
    ratings: {
        type: [new Schema({
            movieId: {
                type: String, // or whatever ID type you're using
                required: true
            },
            rating: {
                type: Number,
                required: true
            }
        }, { _id: false })],
        default: []
    }
},{timestamps:true}) ;

const User = mongoose.model("users",userschema);
module.exports = User;