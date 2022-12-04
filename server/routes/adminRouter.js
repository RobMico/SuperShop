const router = new require('express')();
const adminControler = require('../controlers/adminControler');
const checkRole = require('../middleware/checkRoleMiddleware');


router.get('/logs',checkRole("ADMIN"), adminControler.downloadLogs);
router.get('/rkeys',checkRole("ADMIN"), adminControler.getRKeys);
router.get('/rfilters',checkRole("ADMIN"), adminControler.getRTypes);
router.post('/rcacheclear',checkRole("ADMIN"), adminControler.clearRCache);
router.post('/rregenerate',checkRole("ADMIN"), adminControler.regenerateRStorage);
router.post('/uploadjson',checkRole("ADMIN"), adminControler.uploadJSON);
router.get('/getfservers', adminControler.getFileServers);
module.exports = router;