const config = require("../config/auth.config");
const db = require("../models");
const nodemailer = require('nodemailer');
const User = db.user;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const exp = 84000;
exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 8)
    });
    user.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: exp 
          });
          res.status(200).send({
            id: user._id,
            username: user.username,
            accessToken: token,
            exp:exp
          });
    })
}

exports.signin =  (req,res)=>{
    User.findOne({username: req.body.username},(err,user)=>{
        if (err) {
            res.status(500).send({ message: err });
            return;
          }
          if (!user) {
            return res.status(404).send({ message: "User Not found." });
          }
          var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
          );
          if (!passwordIsValid) {
            return res.status(401).send({
              accessToken: null,
              message: "Invalid Password!"
            });
          }
          var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: exp 
          });
          res.status(200).send({
            id: user._id,
            username: user.username,
            accessToken: token,
            exp:exp
          });
    })
}

exports.forgetpw = (req,res)=>{
  let uname = req.params.uname;
  User.findOne({username:uname},(err,user)=>{
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 900 
    });
    let transporter = nodemailer.createTransport(config.mailTransporter);
    let mailData = {
        from: '"On Passive" <manoharsuthra@gmail.com>',
        to: uname,
        subject: 'Password Reset Link',
        html: `<p>Click <a href="${config.client_url}/reset-password/${token}">here</a> to Reset your Password</p> <p>Note:This link will be expired in 15 minutes </p>`
    };
    transporter.sendMail(mailData, (err, info) => {
        if (err) {
            return res.send({ message: "Mail Error!" });
        }
        res.send({ message: "Password Reset Link sent to mail" });
    })
  })
}

exports.resetpw = (req,res)=>{
  let data = {
    password: bcrypt.hashSync(req.body.password, 8)
  }
  User.updateOne({_id:req.userId},data,(err,response)=>{
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(201).send({
      message:"Password changed successfully"
    })
  })
}