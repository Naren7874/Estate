import prisma from "../lib/prisma.js";
import jwt from 'jsonwebtoken';

export const getPosts = async (req, res) => {
    const query = req.query;
    console.log(query);

    try {
        const posts = await prisma.post.findMany({
            where: {
                city: query.city || undefined,
                type: query.type || undefined,
                property: query.property || undefined,
                bedroom: parseInt(query.bedroom) || undefined,
                price: {
                    gte: parseInt(query.minPrice) || undefined,
                    lte: parseInt(query.maxPrice) || undefined,
                },
            },
        });
        console.log(posts);
        return res.status(200).json(posts);  // Return after sending response
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred while getting posts' });  // Return after sending response
    }
};

export const getPost = async (req, res) => {
    const id = req.params.id;

    try {
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                PostDetail: true,
                user: {
                    select: {
                        username: true,
                        avatar: true,
                    },
                },
            },
        });

        const token = req.cookies?.token;

        if (token) {
            return jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
                if (err) {
                    return res.status(200).json({ ...post, isSaved: false });  // Return default response if token is invalid
                }

                const saved = await prisma.savedPost.findUnique({
                    where: {
                        userId_postId: {
                            postId: id,
                            userId: payload.id,
                        },
                    },
                });

                return res.status(200).json({ ...post, isSaved: saved ? true : false });  // Return response after verifying token
            });
        }
            return res.status(200).json({ ...post, isSaved: false });  // Return response if no token
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to get post" });  // Return after sending response
    }
};

export const createPost = async (req, res) => {
    const body = req.body;
    const tokenUserId = req.userId;

    try {
        const newPost = await prisma.post.create({
            data: {
                ...body.postData,
                userId: tokenUserId,
                PostDetail: {
                    create: body.PostDetail,
                },
            },
        });
        return res.status(201).json(newPost);  // Return after sending response
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred while creating post' });  // Return after sending response
    }
};

export const updatePost = async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    try {
        const updatedPost = await prisma.post.update({
            where: { id },
            data: body,
        });
        return res.status(200).json(updatedPost);  // Return after sending response
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred while updating post' });  // Return after sending response
    }
};

export const deletePost = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;

    try {
        const post = await prisma.post.findUnique({
            where: { id },
        });

        if (post.userId !== tokenUserId) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });  // Return after sending response
        }

        await prisma.post.delete({
            where: { id },
        });

        return res.status(200).json({ message: 'Post deleted successfully' });  // Return after sending response
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'An error occurred while deleting post' });  // Return after sending response
    }
};
