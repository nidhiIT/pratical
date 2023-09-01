const User = require("../models/usermodel");
const bcryptjs = require("bcryptjs")
const config = require("../config/config")
const jwt = require('jsonwebtoken')
const create_token = async(id)=>{
    try{
     const token = await jwt.sign({_id:id},config.secret_jwt) 
     return token

    }catch(error){
        res.status(400).send(error.message)
    }
}
const securePassword=async(password)=>{
    try{

       const passwordhash = await bcryptjs.hash(password,10)
      return passwordhash;
    }catch(error){
        res.status(400).send(error.message)

    }

}

const register_user = async(req,res)=>{

    try{
        const spassword=await securePassword(req.body.password)
        const user =  new User({
            name : req.body.name,
            email:req.body.email,
            password: spassword,
            mobile : req.body.mobile,
            image:req.file.filename,
            type:req.body.type
         })

         const userData = await User.findOne({email:req.body.email})
         if(userData){
            res.status(200).send({success:false,msg:"this email already exit"})

         }else{
           const user_data =  await user.save();
           res.status(200).send({sucess:true,data:user_data})
         }

    }
    catch (error){
        res.status(400).send(error.message)
    

    }
}

//login method call
  const user_login = async(req,res) =>{
    try{
         const email= req.body.email;
         const password= req.body.password
       const userdata =  await  User.findOne({email: email})
       if(userdata){
     const passwordmatch =   await  bcryptjs.compare(password,userdata.password)
       if(passwordmatch){
       const tokendata = await create_token(userdata._id)
            const userResult={
                _id:userdata._id,
                name : userdata.name,
                email:userdata.email,
                password:userdata.password,
                image:userdata.image,
                mobile:userdata.mobile,
                type:userdata.type,
                token:tokendata
                

            }
            const response = {
                sucess:true,
                msg:"user details",
                data:userResult
            }
            res.status(200).send(response)

       }
       else{
        res.status(200).send({success:false,msg:"login details are incorrect"})
       }

       }
       else{
        res.status(200).send({success:false,msg:"login details is incorrect"})
       }

    }
    catch(error){
        res.status(400).send(error.message)

    }
  }
module.exports ={
    register_user,
    user_login
}