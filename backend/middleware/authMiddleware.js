const jwt    = require('jsonwebtoken');
const Item   = require('../models/Item');
const multer = require('multer');
const path   = require('path');

// ── 1. Verify JWT token ──────────────────────────────────────────────
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'No token provided. Unauthorized.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Invalid or expired token.' });
  }
};

// ── 2. Verify item ownership ─────────────────────────────────────────
const authorize = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ status: 'error', message: 'Item not found.' });
    }
    if (item.userID.toString() !== req.user.id) {
      return res.status(403).json({ status: 'error', message: 'Forbidden. You do not own this item.' });
    }
    req.item = item;
    next();
  } catch (err) {
    next(err);
  }
};

// ── 3. Validate register body ────────────────────────────────────────
const validateRegister = (req, res, next) => {
  console.log('Validating registration data:', req.body);
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ status: 'error', message: 'Name, email and password are required.' });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ status: 'error', message: 'Valid email is required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ status: 'error', message: 'Password must be at least 6 characters.' });
  }
  next();
};

// ── 4. Validate login body ───────────────────────────────────────────
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ status: 'error', message: 'Email and password are required.' });
  }
  next();
};

// ── 5. Validate item body ────────────────────────────────────────────
const validateItem = (req, res, next) => {
  const { title, type } = req.body;
  if (!title) {
    return res.status(400).json({ status: 'error', message: 'Title is required.' });
  }
  if (!type || !['lost', 'found'].includes(type)) {
    return res.status(400).json({ status: 'error', message: 'Type must be lost or found.' });
  }
  next();
};

// ── 6. Validate coordinates ──────────────────────────────────────────
const locationValidate = (req, res, next) => {
  const { coordinates } = req.body;
  if (coordinates) {
    const { lat, lng } = coordinates;
    if (
      lat === undefined || lng === undefined ||
      isNaN(lat) || isNaN(lng) ||
      lat < -90 || lat > 90 ||
      lng < -180 || lng > 180
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid coordinates. lat: -90 to 90, lng: -180 to 180.',
      });
    }
  }
  next();
};

// ── 7. File upload (multer) ──────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  console.log('File received:', { filename: file.originalname, mimetype: file.mimetype, fieldname: file.fieldname });
  const allowed = /jpeg|jpg|png|webp/;
  if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
    console.log('File accepted');
    return cb(null, true);
  }
  console.log('File rejected - invalid type');
  cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed.'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = { protect, authorize, validateRegister, validateLogin, validateItem, locationValidate, upload };