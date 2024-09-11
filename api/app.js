import express from 'express';
import authRoutes from './routes/auth.route.js';
import testRoute from './routes/test.route.js'
import userRoutes from './routes/user.route.js';
import postRoute from './routes/post.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const port = 8000;

app.use(cors({origin: process.env.CLIENT_URL , credentials: true}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoute);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
