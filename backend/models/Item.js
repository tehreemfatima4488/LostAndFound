const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: String,
    category: String,
    type: { type: String, enum: ['lost', 'found'], required: true },
    locationText: String,
    coordinates: {
        lat: Number,
        lng: Number
    },
    date: Date,
    imageUrl: String,
    status: { type: String, enum: ['active', 'recovered'], default: 'active' },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// When status is recovered, automatically set type to found
itemSchema.pre('save', function() {
  if (this.status === 'recovered') {
    this.type = 'found';
  }
});

module.exports = mongoose.model('Item', itemSchema);