const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    coin: String,
    price: Number,
    type: String,
    mobile: String,
    call: Boolean,
    sms: Boolean,
    whatsapp: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model('alert', alertSchema)
