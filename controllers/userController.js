import userModel from "../models/userModel.js";


export const userUpdateController = async(req,res)=>{

    const {name , lastname , location} = req.body;

    // if(!name || !email || !lastname || !location)
    // {
    //     return next('Please ')
    // }

    const user = await userModel.findById({_id:req.user.userid});
    if(name)
    {
        user.name = name;
    }
    if(lastname)
    {
        user.lastName=lastname;
    }
    if(location)
    {
        user.location=location;
    }

    await user.save();
    const token = user.createJWT();

    res.cookie('token', token, { 
        httpOnly: true, 
        secure: true, 
        maxAge: 3600000 // 1 hour in milliseconds
      });
      
    res.status(200).send({
        user,
        token
    });


};