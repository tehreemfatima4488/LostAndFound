const User = require('../models/User');
const Item = require('../models/Item');

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.getUserItems = async (req, res, next) => {
  try {
    const items = await Item.find({ userID: req.params.id }).populate('userID', 'name email');
    res.json({
      count: items.length,
      data: items
    });
  } catch (err) {
    next(err);
  }
};
