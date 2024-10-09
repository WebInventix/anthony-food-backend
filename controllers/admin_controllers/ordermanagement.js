const mongoose = require("mongoose");
const { Vendors } = require("../../models/vendors");
const { Orders } = require("../../models/orders");
const { Products } = require("../../models/products");

const getAdminOrders = async (req, res) => {
  const { body, params } = req;
  const { store, vendor } = params;
  console.log(params);
  try {
    var orders;
    if (store && vendor) {
      orders = await Orders.find({ store_id: store, vendor_id: vendor })
        .populate("product_id")
        .populate("user_id")
        .populate("vendor_id");
    } else if (store && !vendor) {
      orders = await Orders.find({ store_id: store })
        .populate("product_id")
        .populate("user_id")
        .populate("vendor_id");
    } else {
      orders = await Orders.find()
        .populate("product_id")
        .populate("user_id")
        .populate("vendor_id");
    }
    console.log("------>", orders);
    return res.status(200).json({ message: "All Orders", orders: orders });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "System Error", error: error.message });
  }
};
const viewOrders = async (req, res) => {
  const { body, params } = req;
  const { order } = params;
  try {
    console.log(order);
    const viewOrder = await Orders.findById(order)
      .populate("product_id")
      .populate("store_id")
      .populate("vendor_id")
      .populate("user_id");
    if (!viewOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json({ message: "View Order", order: viewOrder });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateOrder = async (req, res) => {
  const { body, user_id } = req;
  const { order_id, status, vendor_id, store_id, quantity } = body;
  try {
    let newData = {};
    if (body.status !== undefined) newData.status = body.status;
    if (body.vendor_id !== undefined) newData.vendor_id = body.vendor_id;
    if (body.store_id !== undefined) newData.store_id = body.store_id;
    if (body.quantity !== undefined) newData.quantity = body.quantity;
    const updatedata = { ...newData };
    const update = await Orders.findByIdAndUpdate(
      order_id,
      { $set: updatedata },
      { new: true, runValidators: true }
    );
    if (!update) {
      return res.status(404).json({ message: "Order Not Found" });
    }
    return res
      .status(200)
      .json({ message: "Order Updated Successfully", data: update });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateMultipleOrders = async (req, res) => {
  const { body } = req;
  const { order_ids, vendor_id } = body;

  if (!Array.isArray(order_ids) || order_ids.length === 0) {
    return res
      .status(400)
      .json({ message: "Order IDs should be a non-empty array" });
  }

  try {
    const update = await Orders.updateMany(
      { _id: { $in: order_ids } },
      { $set: { vendor_id } },
      { new: true, runValidators: true }
    );

    if (update.matchedCount === 0) {
      return res.status(404).json({ message: "No Orders Found" });
    }

    return res.status(200).json({
      status: "success",
      message: `Updated ${update.modifiedCount} orders successfully`,
      // data: update,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminOrders,
  viewOrders,
  updateOrder,
  updateMultipleOrders,
};
