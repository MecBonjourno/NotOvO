const express = require('express')
const app = express()
const mongoose = require('mongoose')

require('dotenv').config();

const PORT = process.env.PORT ||5000
const uri = process.env.MONGO_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connection.on('connected',()=>{
    console.log("connected to mongo HOORAY🙌 ")
})

mongoose.connection.on('error', (err) => {
    console.log("connected to mongo", err)
})

require('./models/user.model')
require('./models/post.model')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT, ()=> {
    console.log("Server is up and running", PORT)
})