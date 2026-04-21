const Item = require('../models/Item');

exports.createItem = async (req, res, next) => {
  try {
    const item = await Item.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ message: 'Item created successfully', item });
  } catch (err) {
    next(err);
  }
};

exports.getItems = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.type)   filter.type   = req.query.type;
    if (req.query.status) filter.status = req.query.status;

    const items = await Item.find(filter).populate('userId', 'name email');
    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate('userId', 'name email');
    if (!item) return res.status(404).json({ status: 'error', message: 'Item not found.' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    Object.assign(req.item, req.body);
    await req.item.save();
    res.json({ message: 'Item updated successfully' });
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