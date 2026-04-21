const router = require('express').Router();
const { protect, upload } = require('../middleware/authMiddleware');
const { uploadImage }     = require('../controllers/uploadController');

router.post('/', protect, upload.single('image'), uploadImage);

module.exports = router;