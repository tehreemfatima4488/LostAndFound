const router = require('express').Router();
const ctrl = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:id', protect, ctrl.getUserProfile);
router.get('/:id/items', protect, ctrl.getUserItems);

module.exports = router;
