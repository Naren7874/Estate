import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getPosts, getPost, createPost, updatePost, deletePost } from '../controllers/post.controller.js'
const route = express.Router();

route.get("/", getPosts);

route.get("/:id", getPost);

route.post("/", verifyToken, createPost);

route.put("/:id", verifyToken, updatePost);

route.delete("/:id", verifyToken, deletePost);

export default route;
