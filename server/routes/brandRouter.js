const router = new require('express')();
const brandControler = require('../controlers/brandControler');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/',checkRole('ADMIN'), brandControler.create);

router.post('/edit', checkRole("ADMIN"), brandControler.edit);

//router.post('/remove',checkRole('ADMIN'), brandControler.removeOne);

router.get('/', brandControler.getAll);

module.exports = router;