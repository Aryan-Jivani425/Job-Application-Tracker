import mongoose from "mongoose";

//schema 
const jobSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            requied: [true, "Companay name is require"],
          },
          position: {
            type: String,
            required: [true, "Job Position is required"],
            maxlength: 100,
          },
          status: {
            type: String,
            enum: ["pending", "reject", "interview"],
            default: "pending",
          },
          workType: {
            type: String,
            enum: ["Full-time", "Part-time", "Internship", "Contaract"],
            default: "Full-time",
          },
          workLocation: {
            type: String,
            default: "Mumbai",
            required: [true, "Work location is required"],
          },
          createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
          },
        },
        { timestamps: true }
);


export default mongoose.model('Job',jobSchema);