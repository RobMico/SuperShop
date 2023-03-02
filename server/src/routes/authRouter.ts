import express from 'express';
const router = express.Router();

import authController from '../controlers/authController';
import ApiError from '../error/ApiError';
import authMiddleware from '../middleware/authMiddleware';
import ErrorHandlerWrap from '../middleware/errorHandlerWrap';

router.post('/register', authController.registration);
router.post('/login', authController.login);
router.get('/auth', authMiddleware, authController.checkAuth);


export default router;