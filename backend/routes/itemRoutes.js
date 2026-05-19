const router = require('express').Router();
const ctrl   = require('../controllers/itemController');
const { protect, authorize, validateItem, locationValidate } = require('../middleware/authMiddleware');

router.get('/',            ctrl.getItems);
router.get('/categories',  ctrl.getCategories);
router.get('/:id',         ctrl.getItemById);
router.post('/',           protect, validateItem, locationValidate, ctrl.createItem);
router.put('/:id',         protect, authorize, locationValidate, ctrl.updateItem);
router.delete('/:id',      protect, authorize, ctrl.deleteItem);
router.put('/:id/recover', protect, authorize, ctrl.recoverItem);

module.exports = router;