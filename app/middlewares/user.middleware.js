const db = require("../models");
const User = db.user;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
checkDuplicateUsername = (req, res, next) => {
  User.findOne({username: req.body.username},(err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }
    next();
  });
};

verifyToken = (req,res,next)=>{
  let token= req.headers["x-access-token"];
  if(!token){
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token,config.secret,(err,decoded)=>{
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  })
}

pwresetvalidate = (req,res,next)=>{
  User.findOne({_id:req.userId},(err,user)=>{
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }
    var isOldPw = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if(isOldPw){
      res.status(403).send({ message: "New Password should be different from old password" });
      return;
    }
    next();
  })
}

const userMiddleware = {
  checkDuplicateUsername,
  verifyToken,
  pwresetvalidate
};

module.exports = userMiddleware;