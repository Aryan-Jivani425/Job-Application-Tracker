import express from 'express';
import userAuth from '../middlewear/authMiddlewear.js';
import { userUpdateController } from '../controllers/userController.js';

//router obj
const router = express.Router();

//get users  get method 

//update users put method
router.put('/update-user',userAuth , userUpdateController);

export default router;