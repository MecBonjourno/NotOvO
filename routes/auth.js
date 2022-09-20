const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const requireLogin = require('../middleware/requireLogin')
require('dotenv').config();
const nodemailer = require('nodemailer')
const senddrigtransport = require('nodemailer-sendgrid-transport')

const jwtsct = process.env.JWT_SCT;

router.post('/signup', (req, res) => {
    const {name,email,password, pic} = req.body
    if(!email || !password || !name){
     return res.status(422).json({error: "please fill all the fields"})
    }
    User.findOne({email:email})
    .then((savedUser) => {
        if(savedUser){
            return res.status(422).json({error: "user already registered"})
        }

        bcrypt.hash(password, 12)
            .then(hashedPassword => {
                const user = new User({
                    email,
                      name,
                       password: hashedPassword,
                        pic
                  })
          
                  user.save()
                  .then(user=>{
                      transport.sendMail({
                          to:user.email,
                          from:"contatogzii@gmail.com",
                          subject: "Welcomo to OvO",
                          html: "<h1>Welcome to OvO</h1>"
                      })
                      res.json({message: "new user created"})
                    })
                  .catch(err=>{console.log(err)}) 
              })
              .catch(err=>{console.log(err)})
            })     
})

router.post('/signin', (req, res) => {
    const {email,password} = req.body

    if(!email || !password){
        res.status(422).json({message: 'enter all fields'})
    }

    User.findOne({email: email})
     .then(savedUser => {
         if(!savedUser){
           return res.status(422).json({message: 'Invalid email or password'})
         }

         bcrypt.compare(password, savedUser.password)
         .then(doMatch=>{
             if(doMatch){
                 const token = jwt.sign({
                     _id: savedUser._id
                    }, jwtsct)
                    const {_id,name,email,followers,following,pic} = savedUser
                    res.json({token, user:{_id,name,email,followers,following,pic}})
             }
             else{
                return res.status(422).json({message: 'Invalid email or password'})
             }
         })
         .catch(err=>{console.log(err)})
     })
})

router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User dont exists with that email"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 36000000
            user.save().then((result)=>{
                transport.sendMail({
                    to:user.email,
                    from:"contatogzii@gmail.com",
                    subject:"password reset",
                    html:`
                    <p>You requested for password reset</p>
                    <h5>click in this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>
                    `
                })
                res.json({message:"check your email"})
            })

        })
    })
})


router.post('/new-password',(req,res)=>{
   const newPassword = req.body.password
   const sentToken = req.body.token
   User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
   .then(user=>{
       if(!user){
           return res.status(422).json({error:"Try again session expired"})
       }
       bcrypt.hash(newPassword,12).then(hashedpassword=>{
          user.password = hashedpassword
          user.resetToken = undefined
          user.expireToken = undefined
          user.save().then((saveduser)=>{
              res.json({message:"password updated success"})
          })
       })
   }).catch(err=>{
       console.log(err)
   })
})

module.exports = router;