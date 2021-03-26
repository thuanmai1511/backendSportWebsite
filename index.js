require('dotenv').config();

const path = require('path');
const port = 8080;

const express = require('express');
const mongoose = require('mongoose');
var cors = require('cors');
const bodyParser = require('body-parser');
// const logger = require('morgan');

const Product = require('./models/products.model');
const { constants } = require('os');
const { router } = require('json-server');
const User = require('./models/user.model');
const user = require('./models/user.model');
const Cart = require('./models/cart.model');
const Order = require('./models/order.model');
const Admin = require('./models/admin.model');
const bcrypt = require('bcrypt');
const md5 = require('md5');
const { updateOne } = require('./models/products.model');
const { log } = require('console');
const { send } = require('process');
const app = express();

app.listen(port, () => console.log(`Example app listening`))

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
// app.use(logger('dev'));

mongoose.connect(process.env.MONGO_URL, (err) =>{
   if(err){
     console.log("Error! " + err);
   }else{
     console.log("successful mongoose connection!");
   } 
});

var conn = mongoose.connection;


//get all products
app.get('/data', function(req,res){
  Product.find({})
  .exec((err,data) => {
    if(err){
      console.log("error!!!");
    }else{
      res.json(data);
    }
  });
});
// get all type products
app.get('/data/type=:type', function(req,res){
  const type = req.params.type;
  Product.find({kind: type})
  .exec((err,data) => {
    if(err){
      console.log("error!!!");
    }else{
      res.json(data);
    } 
  });
});
// login

app.post('/login', function(req,res){
  User.find({email: req.body.email})
    .then((result) => {
      console.log(result[0].password);
      console.log("--------------");
       console.log(md5(req.body.password));
        if(result[0].password == md5(req.body.password)) {
          
          res.status(200).send({
              valid: true,
              message: "Successful Login",
              email: result[0].email,
              id: result[0]._id
          })
          
        }else {
          res.status(200).send({
            valid: false,
            message: "Password Wrong"
          })
        }
  }).catch(err => {
    res.status(200).send({
      valid : false,
      message: "User not found"
    })
  })
})


app.post("/signup", function(req, res){
  const username = req.body.username
  const password = md5(req.body.password);
  const email = req.body.email;
  const phone = req.body.phone;
  // console.log("----------Ma Hoa ----------");
  // console.log(req.body.password);

  User.create({
    username: username,
    password: password,
    email: email,
    phone: phone
  },function(err, user){
    if(err){
      console.log(err);
    }else {
      console.log("Added successful"+user.username);
    }
  })
  
})
  
app.get('/data/id=:id', function(req,res){
  const id = req.params.id;
  Product.find({"_id" : id})
  .exec((err,data)=>{
    if(err) {
      console.log(err);
    }else {
      res.json(data);
    }
    
  });
});



app.post('/addToCart', function(req,res){
  var idProduct = req.body.id;
  var quantity = req.body.quantum;
  var size = req.body.size;
  var idUser = req.body.idUser;
  // console.log(req.body);
  
  Cart.findOne({
    idUser: idUser,
    idProduct: idProduct,
    size: size
  })
  .then(cart =>{
    if(!cart) {
      Product.find({
        _id:idProduct
      })
      .then(data=>{
        Cart.create({
          idProduct: idProduct,
          idUser: idUser,
          quantum: quantity,
          size: size,
          name: data[0].name,
          price: data[0].price,
          image: data[0].image,
          description:data[0].description
        })
      })
      
    } 
    else {
      const num = quantity;
      // console.log(num);
      const Number = cart.quantum;
      // console.log(Number);
      const condition = {
        idUser: idUser,
        idProduct: idProduct
      }
      const update = {quantum: Number + num}
      console.log(update);
      Cart.updateOne(condition,update)
      .then(done =>{
        res.json("done");
      })

    }
  })
 
})
 //Cart
app.get('/Cart/:userId' ,function(req,res){
  const userId = req.params.userId;
  // console.log(userId);
  Cart.find({'idUser' : userId})
  .exec((err,data)=>{
    if(err) {
      console.log("err");
    } else {
      res.json(data);
      // console.log(data);
    }
  })
})

app.post('/updateCart', function(req,res) {
  let id = req.body.id;
  let num = req.body.num;
  console.log(num);

  
  Cart.findOne({_id: id,})
  .then(data => {
    // console.log(data);
    Cart.updateOne(
      {_id: id}, {quantum: data.quantum + num}
    ).then(() => {
      res.json(200)
    })
  })
  
   
})

// Delete Cart
app.post('/deleteCart', function(req ,res) {
  let id = req.body.id;
  console.log(id);
  Cart.findOneAndDelete({
    _id: id
  }).then(()=> {
    res.json(200)
  })
})

// Orders
app.post("/Order", function(req, res) {
  var dateTime = new Date();
  // console.log(dateTime);
  var name = req.body.name;
  var address = req.body.address;
  var email = req.body.email;
  var phone = req.body.phone;
  var order = req.body.order;
  var userId = req.body.userId;
  var note = req.body.note;
  var total = req.body.total;
  
  console.log(total);
  Order.create({
    name: name,
    address: address,
    product: order,
    email: email,
    userId: userId,
    note: note,
    status: "",
    date: dateTime,
    total: total,
    phone: phone

  }, function(err){
      if(err) {
        console.log("error");
      } else {
        console.log("Added success order" + name);
      }
  })
})  // no k co update do


app.get('/Order/:idUser' ,function(req, res){
  const idUser = req.params.idUser;
  // console.log(idUser);
  Order.find({'userId': idUser})
  .exec( (err,data)=>{
    if(err){
      console.log("err");
    }else {
      res.json(data);
      // console.log(data);
    }
  })
})


app.get('/Order' ,function(req, res){
 
  Order.find({})
  .exec( (err,data)=>{
    if(err){
      console.log("err");
    }else {
      res.json(data)
      
    }
  })
})

// Admin 


app.post('/loginAdmin', function(req, res){
 Admin.find({admin: req.body.admin})
  .then((resq)=> {
    console.log(resq[0].password, req.body.password);
    
    if(resq[0].password == req.body.password){

      res.status(200).send({
        valid: true,
        message: "Successful Login",
        id: resq[0]._id
    })
           
        
    }else {
      res.status(200).send({
        valid: false,
        message: "Password Wrong"
      })
    }
  })
 })
// Del Product Admin 

app.post('/deleteProduct', function(req ,res) {
  let id = req.body.id;
  console.log(id);
  Product.findOneAndDelete({
    _id: id
  }).then(()=> {
    res.json(200)
  })
})
// Del Order Admin
app.post('/deleteOrder', function(req ,res) {
  let id = req.body.id;
  // console.log(id);
  Order.findOneAndDelete({
    _id: id
  }).then(()=> {
    res.json(200)
  })
})

// view order

app.get('/viewOrder' , function(req, res) {
  Order.find({})
  .exec((err,data)=>{
    if(err) {
      console.log("Err");
    } else {
      res.json(data)
    }
  })
})


app.post('/updateStatus' , function(req , res) {
  // console.log(req.body.status);
  // console.log(req.body.id);
  const id = req.body.id;
  const Status = req.body.status;
  console.log(Status);
  Order.findOne({_id: id,})
  .then(data => {
    // console.log(data);
    Order.updateOne(
      {_id: id}, {status: Status}
    ).then(() => {
      res.json(200)
    })
  
  })
})

// add product admin
app.post('/data', function(req,res){
  const name = req.body.nameAdd;
  const price = req.body.priceAdd;
  const quantity = req.body.quantityAdd;
  const kind = req.body.kindAdd;
  const description = req.body.descriptionAdd;
  const image = req.body.imageAdd;
  
  Product.create({
    name: name,
    quantity: quantity,
    price: price,
    kind: kind,
    description: description,
    image: image
  })

})

// edit products admin
app.post("/data/id=",function(req ,res){
  const id = req.body.id;
  const name = req.body.nameEdit;
  const price = req.body.priceEdit;
  const image = req.body.imageEdit;
  const quantity = req.body.quantityEdit;
  const kind = req.body.kindEdit;

    Product.updateOne({
        _id: id},
        { 
        name: name,
        quantity: quantity,
        kind: kind,
        price: price,
        image: image
        }
    ).then(()=>{
      res.json(200)
    })
  
})

// discount
app.get('/discount/' ,(req, res)=>{
  console.log(req.query.value);

  res.json(req.query.value==='flash25'?25:0)

})





