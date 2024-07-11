const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportschema = new Schema({
    FirstName:{
        type:String ,
        required:true
    },
    LastName:{
        type:String ,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    
    Questions:{
        type:String,
        required:true
    },
},{timestamps:true}) ;

const report = mongoose.model("reports",reportschema);
module.exports = report;