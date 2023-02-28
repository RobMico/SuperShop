const router = new require('express')();
const commentControler = require('../controlers/commentControler');
const checkRole = require('../middleware/checkRoleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/',authMiddleware, commentControler.postNew);

router.post('/edit',authMiddleware, commentControler.edit);

router.post('/remove', checkRole("ADMIN"), commentControler.remove);
//router.get('/', authMiddleware, commentControler.getComments);

module.exports = router;