import userModel from "../models/userModel.js";

export const registerController = async (req,res,next)=>{
    const { name, email, password } = req.body;

    //validate all 
    if (!name) {
        // return res.status(400).send({sucess:false , message:"Please Provide name"});
        return next("name is required"); // when there is an argument in next express will automatically know that there was an error 
        // return ;
    }
    if (!email) {
        // return res.status(400).send({sucess:false , message:"Please Provide email"});
        return  next("email is required");
        // return ;
    }
    if (!password) {
        // return res.status(400).send({sucess:false , message:"Please Provide Password"});
        return next("password is required and greater than 6 character");
        // return ;
    }
    const exisitingUser = await userModel.findOne({email});
    if (exisitingUser) {
        return  next("Email Already Register Please Login");
        // return res.status(200).send({sucess:false , message:"Already exists with this email"});
        // return ;
        
    }
    const user = await userModel.create({ name, email, password });
    // generating the token
    const token = user.createJWT();

    res.cookie('token', token, { 
        httpOnly: true, 
        secure: true, 
        maxAge: 3600000 // 1 hour in milliseconds
    });

    res.status(201).send({
        sucess:true , 
        message:"User Created Successfully", 
        user:{
            name:user.name,
            lastname:user.lastName,
            email:user.email,
            location:user.location
        },
        token
    });

};

export const loginController = async (req,res,next)=>{
    const {email,password} = req.body;

    if(!email || !password)
    {
        return next('Please provide all fields');
    }
    else
    {
        const user = await userModel.findOne({email}).select("+password");;
        if(!user)
        {
            return next('Invalid user name or password');
        }
        else
        {
            const isMatch = await user.comparePassword(password);
            if(!isMatch)
            {
                return next('Invalid user name or password');
            }
            else
            {
                user.password=undefined;
                const token = user.createJWT();

                res.cookie('token', token, { 
                    httpOnly: true, 
                    secure: true, 
                    maxAge: 3600000 // 1 hour in milliseconds
                });
                res.status(200).send({
                    sucess:true , 
                    message:"Login Succesfully", 
                    user,
                    token
                });
            }
        }
    }
};

