import express from 'express';
const router = express.Router();
import brandControler from '../controlers/brandControler';
import checkRole from '../middleware/checkRoleMiddleware';

router.post('/',checkRole('ADMIN'), brandControler.create);

router.post('/edit', checkRole("ADMIN"), brandControler.edit);

//router.post('/remove',checkRole('ADMIN'), brandControler.removeOne);

router.get('/', brandControler.getAll);

router.get('/carousel', brandControler.getCarousel);

export default router;