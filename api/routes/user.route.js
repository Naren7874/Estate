import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';

import {getUsers,getUser,updateUser,deleteUser,savePost, profilePost} from '../controllers/user.controller.js'
const router = express.Router();


// Define routes
router.get('/',getUsers);
// router.get('/:id',verifyToken, getUser);
router.put('/:id',verifyToken, updateUser);
router.delete('/:id',verifyToken, deleteUser);
router.post('/save',verifyToken, savePost);
router.get('/profilePost',verifyToken, profilePost);

export default router;
