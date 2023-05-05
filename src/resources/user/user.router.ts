import express, { Request, Response, NextFunction } from 'express';
import { signupUser } from './user.controller';

const router = express.Router();

router.post('/', signupUser);

export default router;