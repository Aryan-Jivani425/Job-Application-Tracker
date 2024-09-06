import mongoose from "mongoose";

const connectDB = async()=>{

    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        // console.log("hiiii");
        console.log(`Connected To Mongodb Database ${mongoose.connection.host}`);

    } catch (error) {
        console.log(`ERROR:::::`,error);
        
    }

};

export default connectDB;