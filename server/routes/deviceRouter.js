const router = new require('express')();
const deviceControler = require('../controlers/deviceControler');
const authMiddleware = require('../middleware/authMiddleware');
const optionalAuthMiddleware = require('../middleware/optionalAuthMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', checkRole('ADMIN'), deviceControler.create);

router.get('/', deviceControler.getAll);

router.get('/rating', optionalAuthMiddleware, deviceControler.loadRating);

router.post('/rating', authMiddleware, deviceControler.postRating);

router.post('/editimgs', checkRole("ADMIN"), deviceControler.editImages);

router.post('/editdevice', checkRole("ADMIN"), deviceControler.editDevice);

router.get('/disabled', checkRole("ADMIN"), deviceControler.getDisabled);

router.post('/setdisable', checkRole("ADMIN"), deviceControler.setDisable);

router.post('/setavaliable', checkRole("ADMIN"), deviceControler.setAvaliable);

//router.post('/rmd', checkRole('ADMIN'), deviceControler.removeOne);

//router.post('/rmr', checkRole('ADMIN'), deviceControler.removeRating);

router.get('/:id', deviceControler.getOne);

module.exports = router;