import express from 'express';
const router = express.Router();

import basketControler from '../controlers/basketControler';
import checkRole from '../middleware/checkRoleMiddleware';
import authMiddleware from '../middleware/authMiddleware';

router.post('/add',authMiddleware, basketControler.add);

//router.post('/buy',authMiddleware, basketControler.buy);

router.post('/remove',authMiddleware, basketControler.remove);

router.get('/', authMiddleware, basketControler.getAll);

export default router;