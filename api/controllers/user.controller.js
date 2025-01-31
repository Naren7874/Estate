import prisma from '../lib/prisma.js'
import bcrypt from 'bcrypt';
export const getUsers = async (req, res) => {

    try {
        console.log("it works")
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'An error occurred while getting users' });
    }

}

export const getUser = async (req, res) => {

    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
        });
        res.status(200).json(user);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'An error occurred while getting user' });
    }

}

export const updateUser = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;
    const { password, avatar, ...inputs } = req.body;
    let updatedPassword = null


    if (tokenUserId !== id) return res.status(403).json({ message: 'Not authorized to update this user' });
    try {

        if (password) {
            updatedPassword = await bcrypt.hash(password, 10);
        }
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                ...inputs,
                ...(updatedPassword && { password: updatedPassword }),
                ...(avatar && { avatar })
            }
        });
        const { password: userPassword, ...rest } = updatedUser
        res.status(200).json(rest);

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'An error occurred while updating users' });
    }

}

export const deleteUser = async (req, res) => {

    const id = req.params.id;
    const tokenUserId = req.userId;

    if (tokenUserId !== id) return res.status(403).json({ message: 'Not authorized to delete this user' });
    try {
        await prisma.user.delete({
            where: { id },
        });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'An error occurred while deleting users' });
    }

}


export const savePost = async (req, res) => {
    const postId = req.body.postId;
    const tokenUserId = req.userId;

    try {
        const savedPost = await prisma.savedPost.findUnique({
            where: {
                userId_postId: {
                    userId: tokenUserId,
                    postId,
                },
            },
        });

        if (savedPost) {
            await prisma.savedPost.delete({
                where: {
                    id: savedPost.id,
                },
            });
            return res.status(200).json({ message: 'Post removed successfully' });
        } else {
            await prisma.savedPost.create({
                data: {
                    userId: tokenUserId,
                    postId,
                },
            });
            return res.status(201).json({ message: 'Post saved successfully' });
        }

    } catch (error) {
        console.log(error);

        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'This post is already saved by the user.' });
        }

        return res.status(500).json({ message: 'An error occurred while saving post' });
    }
};


export const profilePost = async (req, res) => {
    const tokenUserId = req.userId;
    try {
      const userPosts = await prisma.post.findMany({
        where: { userId: tokenUserId },
      });
      const saved = await prisma.savedPost.findMany({
        where: { userId: tokenUserId },
        include: {
          post: true,
        },
      });
  
      const savedPosts = saved.map((item) => item.post);
      res.status(200).json({ userPosts, savedPosts });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to get profile posts!" });
    }
  };
  