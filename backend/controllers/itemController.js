const Item = require('../models/Item');

// Available item categories
const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Documents',
  'Keys',
  'Accessories',
  'Books',
  'Jewelry',
  'Bags',
  'Shoes',
  'Other',
];

exports.createItem = async (req, res, next) => {
  try {
    const itemData = { ...req.body, userID: req.user.id };
    
    // Handle file upload
    if (req.file) {
      itemData.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    
    const item = await Item.create(itemData);
    res.status(201).json({ message: 'Item created successfully', item });
  } catch (err) {
    next(err);
  }
};

exports.getCategories = (req, res) => {
  console.log('GET /categories endpoint called');
  console.log('Sending categories:', CATEGORIES);
  res.json(CATEGORIES);
};

exports.getItems = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.type)   filter.type   = req.query.type;
    if (req.query.status) filter.status = req.query.status;

    const items = await Item.find(filter).populate('userID', 'name email');
    res.json({
      "count": items.length,
      "data": [...items]});
  } catch (err) {
    next(err);
  }
};

exports.getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate('userID', 'name email');
    if (!item) return res.status(404).json({ status: 'error', message: 'Item not found.' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    
    // Handle file upload
    if (req.file) {
      updateData.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    
    Object.assign(req.item, updateData);
    await req.item.save();
    res.json({ message: 'Item updated successfully', item: req.item });
  } catch (err) {
    next(err);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    await req.item.deleteOne();
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    next(err);
  }
};

exports.recoverItem = async (req, res, next) => {
  try {
    if (req.item.status === 'recovered') {
      return res.status(409).json({ status: 'error', message: 'Item is already recovered.' });
    }
    req.item.status = 'recovered';
    await req.item.save();
    res.json({ message: 'Item marked as recovered', status: 'recovered' });
  } catch (err) {
    next(err);
  }
};