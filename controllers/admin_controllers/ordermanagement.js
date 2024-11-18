const mongoose = require("mongoose");
const { Vendors } = require("../../models/vendors");
const { Orders } = require("../../models/orders");
const { Products } = require("../../models/products");
const { sendVendorEmail } = require("../../utils/email");

const getAdminOrders = async (req, res) => {
  const { params } = req;
  const { store, vendor } = params;

  try {
    let query = {};

    if (store && vendor) {
      query = {
        $and: [
          { vendor_id: vendor },
          { $or: [{ store_id: store }, { store_id: null }] },
        ],
      };
    } else if (store && !vendor) {
      query = {
        $or: [{ store_id: store }, { store_id: null }],
      };
    }

    const orders = await Orders.find(query)
      .populate("product_id")
      .populate("user_id")
      .populate("store_id")
      .populate("vendor_id");

    return res.status(200).json({ message: "All Orders", orders });
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
    // console.log(order);
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
    if (status !== undefined) newData.status = status;
    if (vendor_id !== undefined) newData.vendor_id = vendor_id;
    if (store_id !== undefined) newData.store_id = store_id;
    if (quantity !== undefined) newData.quantity = quantity;
    const updatedata = { ...newData };
    const update = await Orders.findByIdAndUpdate(
      order_id,
      { $set: updatedata },
      { new: true, runValidators: true }
    );
    if (!update) {
      return res.status(404).json({ message: "Order Not Found" });
    }

    // Fetch vendor details if vendor_id is updated
    if (vendor_id) {
      const vendor = await Vendors.findById(vendor_id);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      const updatedOrder = await Orders.findById(order_id).populate(
        "product_id store_id user_id"
      );

      const emailMessage = `
        Dear ${vendor.name},
        
        Your vendor ID (${vendor_id}) has been assigned to Order ID: ${order_id}. 
        Please review the updated details below:
        
        Order Details:
        - Order ID: ${updatedOrder._id}
        - Product: ${updatedOrder.product_id.name}
        - Store: ${updatedOrder.store_id.name}
        - User: ${updatedOrder.user_id.name} (${updatedOrder.user_id.email})
        - Quantity: ${updatedOrder.quantity}
        - Status: ${updatedOrder.status}
        - Delivery Type: ${updatedOrder.delivery_type}
        - Comment: ${updatedOrder.comment || "No comment"}
        
        Please take the necessary actions.

        Regards,
        Your Team
      `;

      // Send email to the vendor
      await sendVendorEmail(vendor.email, emailMessage);

      console.log(`Email sent to vendor: ${vendor.email}`);
    }

    return res
      .status(200)
      .json({ message: "Order Updated Successfully", data: update });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



const getOrderByVendor = async(req,res) => {
  const {vendor } = req.params
  try {
    const orders = await Orders.find({ vendor_id: vendor }).populate("store_id")
    .populate("product_id")
    .populate("vendor_id");
    return res.status(200).json({ message: "Orders found", data: orders })
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
    
  }
}
// const updateMultipleOrders = async (req, res) => {
//   const { body } = req;
//   const { order_ids, vendor_id } = body;

//   if (!Array.isArray(order_ids) || order_ids.length === 0) {
//     return res
//       .status(400)
//       .json({ message: "Order IDs should be a non-empty array" });
//   }

//   try {
//     const update = await Orders.updateMany(
//       { _id: { $in: order_ids } },
//       { $set: { vendor_id } },
//       { new: true, runValidators: true }
//     );

//     if (update.matchedCount === 0) {
//       return res.status(404).json({ message: "No Orders Found" });
//     }

//     return res.status(200).json({
//       status: "success",
//       message: `Updated ${update.modifiedCount} orders successfully`,
//       // data: update,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
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
    const vendor = await Vendors.findById(vendor_id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Fetch the updated order details to include in the email
    const updatedOrders = await Orders.find({
      _id: { $in: order_ids },
    }).populate("product_id store_id user_id");

    let emailMessage = `
      Dear ${vendor.name},

      Your vendor ID (${vendor_id}) has been assigned to the following orders:
      
      Order Details:
    `;

    // Loop through the updated orders to add details to the email message
    updatedOrders.forEach((order) => {
      emailMessage += `
        - Order ID: ${order._id}
        - Product: ${order.product_id.name}
        - Store: ${order.store_id.name}
        - User: ${order.user_id.name} (${order.user_id.email})
        - Quantity: ${order.quantity}
        - Status: ${order.status}
        - Delivery Type: ${order.delivery_type}
        - Comment: ${order.comment || "No comment"}
        
      `;
    });

    // Append the closing message
    emailMessage += `
      Please review the details and take the necessary actions.

      Regards,
      Your Team
    `;

    await sendVendorEmail(vendor.email, emailMessage);

    return res.status(200).json({
      status: "success",
      message: `Updated ${update.modifiedCount} orders successfully and notified vendor.`,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



const deleteMultipleOrders = async (req, res) => {
  const { ids } = req.body; // Array of order IDs to delete

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({
      message: "Invalid input. Please provide an array of order IDs.",
    });
  }

  try {
    const result = await Orders.deleteMany({ _id: { $in: ids } });

    return res.status(200).json({
      message: `${result.deletedCount} orders deleted successfully.`,
    });
  } catch (error) {
    return res.status(500).json({
      message: "System Error",
      error: error.message,
    });
  }
};
module.exports = {
  getAdminOrders,
  viewOrders,
  updateOrder,
  updateMultipleOrders,
  getOrderByVendor,
  deleteMultipleOrders
};
