import jobsModel from "../models/jobsModel.js";
import mongoose from "mongoose";
import moment from "moment";//when we want to deal with time and date

// CREATE JOBS
export const jobController = async(req,res,next)=>{

    const {company , position }  = req.body;

    if(!company || !position)
    {
        return next('Please Provide All nesssary fields');
    }
    else
    {
        req.body.createdBy = req.user.userid;
        const job = await jobsModel.create(req.body);
        res.status(201).send({
            sucess:true , 
            message:"Job created Succesfully",
            job
        })
    }
};


// GET ALL JOBS
export const getAllJobsController = async (req,res)=>{

    const {status, workType,search,sort} = req.query;
    //conditons for searching filters
    const queryObject = {
        createdBy: req.user.userid,
    };
    //logic filters
    if (status && status !== "all") {
        queryObject.status = status;
    }

    if (workType && workType !== "all") {
        queryObject.workType = workType;
    }

    if (search) {
        queryObject.position = { $regex: search, $options: "i" };
    }

    let queryResult =  jobsModel.find(queryObject);

    //sorting
    if (sort === "latest") {
        queryResult = queryResult.sort("-createdAt");
    }
    if (sort === "oldest") {
        queryResult = queryResult.sort("createdAt");
    }
    if (sort === "a-z") {
        queryResult = queryResult.sort("position");
    }
    if (sort === "z-a") {
        queryResult = queryResult.sort("-position");
    }


    //pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    queryResult = queryResult.skip(skip).limit(limit);
    //jobs count
    const totalJobs = await jobsModel.countDocuments(queryResult);
    const numOfPage = Math.ceil(totalJobs / limit);

    const jobs = await queryResult;
    
    
    // const jobs = await jobsModel.find({createdBy:req.user.userid});
        res.status(200).send({
            totalJobs:jobs.length,
            jobs,
            numOfPage
        });
    };

//UPDATE JOBS 
export const updateJobController = async(req,res,next)=>{

    const {jobid}=req.params;
    const {company , position} = req.body;

    if(!company || !position)
    {
        return next('Please Provide All nesssary fields');
    }
    else
    {
        const job = await jobsModel.findOne({_id:jobid});
        
        if(!job)
        {
            return next(`No Jobs With Such such id : ${jobid}`);
        }
        else if(!(req.user.userid === job.createdBy.toString()))
        {
            return next('Your are not authrorized to update this job');
        }
        else
        {
            const updateJob = await jobsModel.findOneAndUpdate({_id:jobid},req.body,{
                new:true,
                //new: true: If this option is set to true, 
                //Mongoose will return the updated document 
                //after the update is applied.
                //new: false (default): If this option is set to false,
                // or if it's not specified, Mongoose will return the 
                //original document before the update was applied.

                runValidators:true
                //Mongoose will ensure that the new data in req.body complies with the schema's validation rules
            });

            res.status(200).send({
                sucess:true , 
                message:"Job Updated Succesfully",
                updateJob
            })

        }
    }


};

//DELETE JOB
export const deleteJobController = async(req,res,next)=>{

    const {jobid}=req.params;

    const job = await jobsModel.findOne({_id:jobid});
    
    if(!job)
    {
        return next(`No Jobs With Such such id : ${jobid}`);
    }
    else if(!(req.user.userid === job.createdBy.toString()))
    {
        return next('Your are not authrorized to delete this job');
    }
    else
    {
        await job.deleteOne();
        res.status(200).send({
            sucess:true , 
            message:"Job Deleted Succesfully", 
        });
    }


};

//GET JOB STATS
export  const jobStatsController = async(req,res,next)=>{

    const stats = await jobsModel.aggregate([
        {
            $match : {
                createdBy:new mongoose.Types.ObjectId(req.user.userid),
            },
        },
        {
            $group:{
                _id:"$status",
                count:{$sum:1},
            }
        },
    ]);

    // Default stats
    const defaultStats = {
        pending: 0,
        reject: 0,
        interview: 0,
    };
    
    // Update defaultStats based on the aggregation results
    stats.forEach((stat) => {
        if (stat._id === "pending") {
        defaultStats.pending = stat.count;
        } else if (stat._id === "reject") {
        defaultStats.reject = stat.count;
        } else if (stat._id === "interview") {
        defaultStats.interview = stat.count;
        }
    });

     //monthly yearly stats
    let monthlyApplication = await jobsModel.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.userid),
            },
        },
        {
            $group: {
                _id:{
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                },
                count: {
                    $sum: 1,
                },
            },
        },
    ]);

    monthlyApplication = monthlyApplication.map((item) => {
      const {_id: { year, month },count,} = item;
      const date = moment().month(month - 1).year(year).format("MMM Y");
      return { date, count };
    });


    res.status(200).send({
        totalJobs: stats.length,
        defaultStats,
        monthlyApplication
    }
    );

};