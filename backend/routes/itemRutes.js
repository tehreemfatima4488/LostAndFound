const router = require('express').Router();
const ctrl   = require('../controllers/itemController');
const { protect, authorize, itemRules, locationValidate } = require('../middleware/authMiddleware');

router.get('/',              ctrl.getItems);                                       // public
router.get('/:id',           ctrl.getItemById);                                    // public
router.post('/',             protect, itemRules, locationValidate, ctrl.createItem); // auth
router.put('/:id',           protect, authorize, locationValidate, ctrl.updateItem); // owner
router.delete('/:id',        protect, authorize, ctrl.deleteItem);                   // owner
router.put('/:id/recover',   protect, authorize, ctrl.recoverItem);                  // owner

module.exports = router;