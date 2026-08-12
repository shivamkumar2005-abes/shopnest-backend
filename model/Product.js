const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  imageURLs: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now
  },
  ratings: {
    type: Number,
    default: 0
  },
  numberOfReviews: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Product", productSchema);