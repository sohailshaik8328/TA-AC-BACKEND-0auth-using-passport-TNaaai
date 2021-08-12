var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passportUserSchema = new Schema({
    name : String,
    email : {type : String, required : true, unique : true},
    username : {type : String, required : true, unique : true},
    password : {type : String},
    photo : {type : String}
}, {timestamps : true});

module.exports = mongoose.model('User', passportUserSchema);