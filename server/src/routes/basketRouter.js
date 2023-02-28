const router = new require('express')();
const basketControler = require('../controlers/basketControler');
const checkRole = require('../middleware/checkRoleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add',authMiddleware, basketControler.add);

//router.post('/buy',authMiddleware, basketControler.buy);

router.post('/remove',authMiddleware, basketControler.remove);

router.get('/', authMiddleware, basketControler.getAll);

module.exports = router;