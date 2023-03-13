import express from 'express';
const router = express.Router();
import brandControler from '../controllers/BrandController';
import checkRole from '../middleware/checkRoleMiddleware';

router.post('/',checkRole('ADMIN'), brandControler.createBrand);
router.post('/edit', checkRole("ADMIN"), brandControler.editBrandData);

//router.post('/remove',checkRole('ADMIN'), brandControler.removeOne);

router.get('/', brandControler.getAllBrands);
router.get('/carousel', brandControler.getImagesCarousel);

export default router;