
const store  = require('../models/storemodel') 
const user = require('../models/usermodel')
const create_store = async(req,res) =>{
try{

    const userdata = await user.findOne({_id : req.body.vendor_id})
    if(userdata){
        if(!req.body.latitude || !req.body.longitude)
        {
            res.status(200).send({success:false,msg:'lat and long is not found'})
        }
        else{

           const vendordata = await  store.findOne({vendor_id: req.body.vendor_id})
           if(vendordata){
            res.status(200).send({success:false,msg:"this vendor is already created a store"})
           }
            else{
                const Store = new store({
                   vendor_id:req.body.vendor_id,
                   logo : req.file.filename,
                   business_email : req.body.business_email,
                   address: req.body.address,
                   pin:req.body.pin,
                   location:{
                    type:"Point",
                    coordinates:[parseFloat(req.body.latitude),parseFloat(req.body.latitude)]
                   }

                })
                const storedata = await Store.save();
                res.status(200).send({success:false,msg:"store Data",data:storedata})
            }
           }
        }

    
    else{
        res.status(200).send({sucess:false,msg :"vendoe Id does not exits"})
    }

 }catch(error){

    res.status(400).send(error.message)

 }

}
module.exports ={
  create_store,
}