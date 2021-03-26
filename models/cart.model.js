const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({
    idProduct: String,
    idUser: String,
    quantum: Number,
    size: Number,
    name: String,
    price: Number,
    image: [],
    description:String
});
const cart = mongoose.model('cart', cartSchema,'cart');



module.exports= cart;