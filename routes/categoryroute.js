const express = require("express")
const category_route = express()

const bodyParser = require('body-parser')
category_route.use(bodyParser.json());
category_route.use(bodyParser.urlencoded({extended:true}))

const auth = require("../middleware/auth")
const category_controller  = require("../controllers/categorycontroller")

category_route.post('/add-category',category_controller.addcategory)

module.exports = category_route
