const router = new require('express')();
const typeControler = require('../controlers/typeControler');
const checkRole = require('../middleware/checkRoleMiddleware');



//router.post('/remove',checkRole('ADMIN'),  typeControler.removeOne);

router.post('/edit',checkRole('ADMIN'),  typeControler.edit);

router.post('/addtypeprop',checkRole('ADMIN'),  typeControler.addTypeProp);

//router.post('/edittypeprop',checkRole('ADMIN'),  typeControler.editTypeProp);

//router.post('/removetypeprop',checkRole('ADMIN'),  typeControler.removeTypeProp);

router.post('/suggestme',checkRole('ADMIN'),  typeControler.loadSuggestions);

router.get('/getprops',  typeControler.getTypeProps);

router.post('/',checkRole('ADMIN'),  typeControler.create);

router.get('/', typeControler.getAll);

module.exports = router;