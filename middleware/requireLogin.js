const jwt = require('jsonwebtoken');
require('dotenv').config();
const mongoose = require('mongoose');
const User = mongoose.model("User")
const jwtsct = process.env.JWT_SCT;

module.exports = (req,res,next) => {
    const {authorization,} = req.headers;
    if(!authorization){
      return  res.status(401).json({error:"you must be logged in to access"})
    }
    const token = authorization.replace("Bearer ", "")
     jwt.verify(token, jwtsct, (err, payload) => {
        if(err){
            res.status(401).json({error:"you must be logged in to access"})
        }

        const {_id} = payload
            User.findById(_id).then(userdata => {
                req.user = userdata
                next()
            })
    })
}