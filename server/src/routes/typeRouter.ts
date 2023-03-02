import express from 'express';
const router = express.Router();

import typeControler from '../controlers/typeControler';
import checkRole from '../middleware/checkRoleMiddleware';
import ErrorHandlerWrap from '../middleware/errorHandlerWrap';

//router.post('/remove',      checkRole('ADMIN'),  typeControler.removeOne);
//router.post('/edittypeprop',checkRole('ADMIN'),  typeControler.editTypeProp);
//router.post('/removetypeprop',checkRole('ADMIN'),  typeControler.removeTypeProp);


router.post('/edit',        checkRole('ADMIN'),  typeControler.edit);
router.post('/addtypeprop', checkRole('ADMIN'),  typeControler.addTypeProp);
router.post('/suggestme',   checkRole('ADMIN'),  typeControler.loadSuggestions);
router.post('/',            checkRole('ADMIN'),  typeControler.create);
router.get( '/getprops',                         typeControler.getTypeProps);
router.get( '/',                                 typeControler.getAll);

export default router;