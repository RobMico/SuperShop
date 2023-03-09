import express from 'express';
const router = express.Router();

import DeviceController from '../controlers/DeviceController';
import authMiddleware from '../middleware/authMiddleware';
import optionalAuthMiddleware from '../middleware/optionalAuthMiddleware';
import checkRole from '../middleware/checkRoleMiddleware';
import ErrorHandlerWrap from '../middleware/errorHandlerWrap';


router.get('/', DeviceController.getAll);
router.get('/rating', optionalAuthMiddleware, DeviceController.loadRating);
router.post('/rating', authMiddleware, DeviceController.postRating);
router.post('/editimgs', checkRole("ADMIN"), DeviceController.editImages);
router.post('/', checkRole('ADMIN'), DeviceController.createDevice);
router.post('/editdevice', checkRole("ADMIN"), DeviceController.editDevice);
router.get('/disabled', checkRole("ADMIN"), DeviceController.getDisabled);
router.post('/setdisable', checkRole("ADMIN"), DeviceController.setDisable);
router.post('/setavaliable', checkRole("ADMIN"), DeviceController.setAvaliable);

//router.post('/rmd', checkRole('ADMIN'), deviceControler.removeOne);

//router.post('/rmr', checkRole('ADMIN'), deviceControler.removeRating);

router.get('/:id', DeviceController.getOne);

export default router;