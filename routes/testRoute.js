import textPostContoller from '../controllers/testController.js';
import express from  "express";
import userAuth from '../middlewear/authMiddlewear.js';

//router object
const router = express.Router();

router.post("/test-post",userAuth,textPostContoller);

export default router;