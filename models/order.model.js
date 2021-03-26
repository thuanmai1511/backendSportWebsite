const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    name: String,
    address: String,
    product: [],
    email: String,
    userId: String,
    note: String,
    date : String,
    status: String,
    phone: String,
    total: String
});
const order = mongoose.model('order', orderSchema,'order');



module.exports= order;