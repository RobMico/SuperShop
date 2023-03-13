import express from 'express';
const router = express.Router();

import adminControler from '../controllers/AdminController';
import checkRole from '../middleware/checkRoleMiddleware';


router.get('/logs',checkRole("ADMIN"), adminControler.downloadLogs);
router.get('/rkeys',checkRole("ADMIN"), adminControler.getAllRedisKeys);
router.get('/rfilters',checkRole("ADMIN"), adminControler.getRedisStorageMap);
router.post('/rcacheclear',checkRole("ADMIN"), adminControler.clearRedisCache);
router.post('/rregenerate',checkRole("ADMIN"), adminControler.regenerateRedisStorage);
router.post('/uploadjson',checkRole("ADMIN"), adminControler.uploadDevicesJson);
router.get('/getfservers', adminControler.getFileHolders);

export default router;