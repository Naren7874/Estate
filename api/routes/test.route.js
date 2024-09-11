import express from 'express';
import { shouldBeAdmin, shouldBeLoggedIn } from '../controllers/test.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const route = express.Router();

route.get("/should-be-logged-in",verifyToken,shouldBeLoggedIn );

route.get("/should-be-admin",shouldBeAdmin );

export default route;
