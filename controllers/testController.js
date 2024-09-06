const textPostContoller = (req,res)=>{
    const {name} = req.body;
    res.status(200).send(`HIIII ${name}`);

};

export default textPostContoller;