const jwt=require("jsonwebtoken");
const config = require("../config/config")

const verifytoken  = async(req,res,next) =>{

    const token = req.body.token ||req.query.token || req.headers["authorization"]
    if(!token){
        res.status(200).send({success:false,msg:"token is required for authoration"})
    }
    try{
        const decoed = jwt.verify(token,config.secret_jwt)
        res.user=decoed

    }catch(error){
        res.status(400).send("invild token")


    }
    return next();

}
module.exports = verifytoken