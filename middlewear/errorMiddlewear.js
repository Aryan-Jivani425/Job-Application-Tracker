// import error  from "console";

const errorMiddlewear = (err,req,res,next)=>{

    // console.log("12123232324");
    console.log(err);
    

    const defaulterror = {
        statuscode:500,
        message:err,
    };
    
    if(err.name === 'ValidationError')
    {
        defaulterror.statuscode=400;
        defaulterror.message= "PPPassword length should be greater than 6 character";
    }

    res.status(defaulterror.statuscode).send({message:defaulterror.message});

};

export default errorMiddlewear;