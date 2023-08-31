const express = require('express')
const user_routes = express()
const bodyParser = require("body-parser")
user_routes.use(bodyParser.json());
user_routes.use(bodyParser.urlencoded({extended:true}))
const multer = require("multer")
const path =require("path")
user_routes.use(express.static('public'))
const  storage =multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/userimage'),function(error,sucess){
            if(error)throw error
        })
    },
       filename : function(req,file,cb){
       const name = Date.now() + '_' + file.originalname;
        cb(null,name,function(error1,sucess1){
            if(error1)throw error1
        })
       }
    }

)
const upload = multer({storage:storage})

const user_controller = require("../controllers/usercontroller")
user_routes.post('/register',upload.single('image') , user_controller.register_user)
module.exports = user_routes
