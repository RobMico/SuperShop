const router = new require('express')();
const userControler = require('../controlers/userControler');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/register', userControler.registration);

router.post('/login', userControler.login);

router.get('/auth',authMiddleware, userControler.checkAuth);

router.get('/comments',authMiddleware, userControler.getComments);

module.exports = router;