var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passportUserSchema = new Schema({
    name : String,
    email : {type : String, required : false, unique : true},
    username : {type : String, required : false, unique : true},
    photo : {type : String}
}, {timestamps : true});

module.exports = mongoose.model('User', passportUserSchema);