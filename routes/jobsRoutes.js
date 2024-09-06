import express from 'express';
import userAuth from '../middlewear/authMiddlewear.js';
import { deleteJobController, getAllJobsController, jobController, jobStatsController, updateJobController } from '../controllers/jobsController.js';

const router = express.Router();

//create job post method
router.post('/create-job', userAuth , jobController);

//get all jobs get method
router.get('/get-jobs', userAuth , getAllJobsController);

//upadete job patch method
router.patch('/update-job/:jobid', userAuth , updateJobController );

//delete job delete method
router.delete('/delete-job/:jobid', userAuth , deleteJobController );

//get stats of job get method
router.get('/job-stats', userAuth , jobStatsController );

export default router ;