const { required } = require("joi");
const mongoose = require("mongoose");

const { Schema } = mongoose;
const Orders = mongoose.model(
  "orders",
  new Schema(
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      store_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "stores",
        required: false,
      },
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vendors",
        required: false,
        default: null,
      },
      quantity: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      delivery_type: {
        type: String,
        enum: ["Urgent", "Normal",null],
        required: false,
        default: null,
      },
      comment: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        enum: ["Unavailable", "Ordered", "Change-quantity"],
        required: true,
        default: "Ordered",
      },
    },
    { timestamps: true }
  )
);

module.exports = { Orders };
