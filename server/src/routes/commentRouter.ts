import express from 'express';
const router = express.Router();

import commentControler from '../controlers/CommentController';
import checkRole from '../middleware/checkRoleMiddleware';
import authMiddleware from '../middleware/authMiddleware';

router.post('/',authMiddleware, commentControler.postComment);

router.post('/edit',authMiddleware, commentControler.editComment);

router.post('/remove', checkRole("ADMIN"), commentControler.removeComment);
//router.get('/', authMiddleware, commentControler.getComments);

export default router;