const mongoose = require("mongoose");

const { Schema } = mongoose;
const Stores = mongoose.model(
  "stores",
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        enum: ["Active", "In-Active"],
        // required:true,
        default: "Active",
      },
      isDeleted: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  )
);

module.exports = { Stores };
