require("dotenv").config();
const express = require('express');
const bodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", 'ejs');
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      };
    });
  });


});

app.post("/login", function(req, res){
  User.findOne({email: req.body.username}, function(err, foundEmail){
    if(err){
      console.log(err);
    } else {
      if (foundEmail) {
        bcrypt.compare(req.body.password, foundEmail.password, function(err, result){
          if (result === true) {
            res.render("secrets");
          };
        });
      };
    };
  });
});


app.listen(3000, function() {
  console.log("Server is running at port 3000");
});
