import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    // Replace 'your_secret_key' with your actual secret key
    return jwt.sign({ id: userId ,isAdmin:false}, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};
export const register = async (req, res) => {
    try {
        // Destructure fields from request body
        const { username, email, password } = req.body;

        // Check if all required fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log(`Hashed Password: ${hashedPassword}`);

        //create a new user 
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
        console.log('User created:', newUser);
        res.send("successfully created");

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'An error occurred during registration' });
    }
};


export const login = async(req, res) => { 
    const {username, password} = req.body;
    
    try{
        //check user exists
        const user = await prisma.user.findUnique({ where: { username } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        //check password
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }



        const{password:userPassword ,...userinfo} = user
        //generate JWT
        const token = generateToken(user.id);
        // Set the JWT in a cookie
        res.cookie('token', token, {
            httpOnly: true,  // JavaScript cannot access this cookie
            maxAge: 3600000 // 1 hour
        })
        .status(200).json({userinfo});

        }catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: 'An error occurred during login' });
        }
};

export const logout = (req, res) => {
    res.clearCookie('token').status(200).json({ message: 'logout successful' });
};
