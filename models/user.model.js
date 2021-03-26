const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    phone: String

});




const user = mongoose.model('user', userSchema, 'user');



module.exports= user;