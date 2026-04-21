const router = require('express').Router();
const { register, login }           = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/authMiddleware');

router.post('/register', validateRegister, register);
router.post('/login',    validateLogin,    login);

module.exports = router;