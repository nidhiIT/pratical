const express = require("express")
const app = express()
const mongoose = require('mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/ecomm")

const user_routes = require("./routes/userroute")
app.use('/api',user_routes)

app.listen(3000,function(){
    console.log("server is ready")
});


