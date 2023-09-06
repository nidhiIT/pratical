const User = require("../models/usermodel");
const bcryptjs = require("bcryptjs")
const config = require("../config/config")
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer")
const rendomstring = require("randomstring")

const sendresetPasswordMail = async(name,email,token)=>{

    try{
       const transport = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailpassword
            }
        })
        const mailoption = {
            from:config.emailUser,
            to:email,
            subject:'for reset password',
            html:'<p> hii ' +name +' please copy the link<a href ="localhost:3000/api/resetpassword?token='+token+'" > and rreset your password</a>'
         }
         transport.sendMail(mailoption,function(error,info){
            if(error){
                console.log(error)
            }
            else{
                console.log("mail has been sent:;",info.response)
            }
         })

    }catch(error){
        res.status(400).send({success:false,msg:error.message})
    }
    
}

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


//update password

const update_password = async(req,res) =>{

    try{
        const user_id = req.body.user_id;
        const password = req.body.password;
        const data = await User.findOne({_id :user_id});
        if(data)
        {
              const newpassword = await securePassword(password);
            const userdata = await User.findByIdAndUpdate({_id :user_id},{$set:{
                password:newpassword
              }})
              res.status(200).send({sucess:true,msg:"your passwordhas been update"})
        }else{
            res.status(200).send({success:false,msg :"user is not found"})
        }

    }catch(error){
        res.status(400).send(error.message0)
    }
}

//forget password

  const forget_password = async(req,res)=>{
    try
    {
        const email = req.body.email;
    const userdata  = await User.findOne({email:email})
    
    if(userdata){
               const  randomstring= rendomstring.generate()
             const data= await User.updateOne({email:email},{$set:{
                token:randomstring
               }})
               sendresetPasswordMail(userdata.name,userdata.email,randomstring)
               res.status(200).send({success:true,msg:"please check your inbox of mail and reset your password"})

    }else{
        res.send(200).send({success:true,msg:"this email is does not exists"})
    }

    }catch(error){
        res.send(400).send({success:false,msg:error.message})
    }
   
  }

  const reset_password = async(req,res) =>{
    try{

        const token = req.query.token;
      const tokendata =   await User.findOne({token:token})
      if(tokendata){
        const password = req.body.password;
        const newpassword = await securePassword(password)
     const userdata=  await User.findByIdAndUpdate({_id:tokendata._id},{$set:{password:newpassword,token:''}},{new:true})
     res.status(200).send({success:true,msg:"User Password has been reset",data:userdata})


      }else{
        res.status(200).send({success:false,msg:"this link has been exprired"})
      }

    }catch(error){
        res.status(400).send({sucess:false,msg:error.message})
    }
  }
module.exports ={
    register_user,
    user_login,
    update_password,
    forget_password,
    reset_password
}