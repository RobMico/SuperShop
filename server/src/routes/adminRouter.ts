import express from 'express';
const router = express.Router();

import adminControler from '../controlers/adminControler';
import checkRole from '../middleware/checkRoleMiddleware';


router.get('/logs',checkRole("ADMIN"), adminControler.downloadLogs);
router.get('/rkeys',checkRole("ADMIN"), adminControler.getRKeys);
router.get('/rfilters',checkRole("ADMIN"), adminControler.getRTypes);
router.post('/rcacheclear',checkRole("ADMIN"), adminControler.clearRCache);
router.post('/rregenerate',checkRole("ADMIN"), adminControler.regenerateRStorage);
router.post('/uploadjson',checkRole("ADMIN"), adminControler.uploadJSON);
router.get('/getfservers', adminControler.getFileServers);

export default router;