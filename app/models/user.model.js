const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: {
      type:String,
      required:true
    },
    password:{
      type:String,
      required:true,
    } ,
    createdOn:{
      type: Date,
      default: Date.now
    }
  })
);

module.exports = User;