import express from 'express';
const router = express.Router();

import commentControler from '../controlers/commentControler';
import checkRole from '../middleware/checkRoleMiddleware';
import authMiddleware from '../middleware/authMiddleware';

router.post('/',authMiddleware, commentControler.postNew);

router.post('/edit',authMiddleware, commentControler.edit);

router.post('/remove', checkRole("ADMIN"), commentControler.remove);
//router.get('/', authMiddleware, commentControler.getComments);

export default router;