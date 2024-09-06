import mongoose from "mongoose";
import validator from "validator"; // req to validate email 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name Is Require"],
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, " Email is Require"],
      unique: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: [true, "password is require"],
      minlength: [6, "Password length should be greater than 6 character"],
      select:false
    },
    location: {
      type: String,
      default: "India",
    }
  },

  { 
    timestamps: true 
  }
);

//middlewear
userSchema.pre('save',async function() {
    
    if(!this.isModified("password"))return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);

});

//password compare  
userSchema.methods.comparePassword = async function(userPassword) {
  
  const isMatch = await bcrypt.compare(userPassword,this.password);
  return isMatch;
}

// JSONwebtoken
userSchema.methods.createJWT = function(){
  
  return jwt.sign({userid:this._id},process.env.JWT_SECRETKEY,{expiresIn:'1d'});
  
}

// module.exports = mongoose.model("User", userSchema);
export default mongoose.model("User", userSchema);
