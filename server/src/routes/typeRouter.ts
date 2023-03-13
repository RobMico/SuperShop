import express from 'express';
const router = express.Router();

import typeController from '../controllers/TypeController';
import checkRole from '../middleware/checkRoleMiddleware';

router.post('/edit', checkRole('ADMIN'), typeController.editType);
router.post('/addtypeprop', checkRole('ADMIN'), typeController.addTypeProp);
router.post('/suggestme', checkRole('ADMIN'), typeController.getCreatePropsSuggestions);
router.post('/', checkRole('ADMIN'), typeController.createType);
router.get('/getprops', typeController.getTypeProps);
router.get('/', typeController.getAllTypes);

export default router;