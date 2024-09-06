import jwt from "jsonwebtoken";

const userAuth = (req,res,next)=>{

    const token = req.cookies.token;
    if(!token)
    {
        return next('Auth Failed');
    }
    else
    {
        const payload = jwt.verify(token,process.env.JWT_SECRETKEY);
        if(!payload)
        {
            return next('Auth Failed');
        }
        else
        {
            req.user = {userid: payload.userid};
            next();
        }
    }

};

export default userAuth;