import expres from 'express';
const router = expres();

import brandRouter from './brandRouter';
import deviceRouter from './deviceRouter';
import typeRouter from './typeRouter';
import authRouter from './authRouter';
import basketRouter from './basketRouter';
import commentRouter from './commentRouter';
import adminRouter from './adminRouter';


router.use('/user', authRouter);
// router.use('/type', typeRouter);
router.use('/brand', brandRouter);
// router.use('/device', deviceRouter);
router.use('/basket', basketRouter);
// router.use('/comment', commentRouter);
// router.use('/admin', adminRouter);

export default router;