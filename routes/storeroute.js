const express = require ('express')
const store_route = express();
const bodyParser = require("body-parser")
store_route.use(bodyParser.json());
store_route.use(bodyParser.urlencoded({extended:true}))
const multer = require('multer')
const path = require('path')
store_route.use(express.static('public'))
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/storeimage'),function(error,success){
            if(error)throw error
        })

    },
    filename:function(req,file,cb){

        const name =Date.now()+ '_'+file.originalname;
        cb(null,name,function(error,success){
         if(error) throw error
        })

    }
})
const upload = multer({storage:storage})
const store_controller = require("../controllers/storecontroller")
const auth = require('../middleware/auth')

store_route.post('/create-store',upload.single('logo'),store_controller.create_store)

module.exports = store_route;