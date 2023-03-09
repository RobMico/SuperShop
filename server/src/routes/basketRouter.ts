import express from 'express';
const router = express.Router();

import basketControler from '../controlers/BasketController';
import checkRole from '../middleware/checkRoleMiddleware';
import authMiddleware from '../middleware/authMiddleware';

router.post('/add',authMiddleware, basketControler.addToBasket);
//router.post('/buy',authMiddleware, basketControler.buy);
router.post('/remove',authMiddleware, basketControler.removeFromBasket);
router.get('/', authMiddleware, basketControler.getBasketDevices);

export default router;