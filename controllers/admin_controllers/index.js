const mongoose = require("mongoose");
const crypto = require("crypto");
const { Stores } = require("../../models/stores");
const { User_Auth_Schema } = require("../../models/user_auth_model");
const { Products } = require("../../models/products");
const { Orders } = require("../../models/orders");

const adminDashboard = async (req, res) => {
  const { params } = req;
  const { store_id } = params;
  try {
    let orders, recentUser;
    if (store_id) {
      orders = await Orders.find({ store_id: store_id })
        .populate("store_id")
        .populate("user_id")
        .populate("product_id")
        .sort({ _id: -1 });

      recentUser = await User_Auth_Schema.findOne({
        store_id: store_id,
        approved_status: "Requested",
      }).sort({ _id: -1 });
    }
    let data = { orders: orders, user: recentUser };

    return res.status(200).json({ message: "Dashboard", data });
  } catch (error) {
    return res.status(500).json({ message: "Error", error: error.message });
  }
};

const generateUniquePid = () => {
  const uniqueId = crypto.randomBytes(3).toString("hex"); // Generates a random 6-character hex string
  return `PID${uniqueId}`;
};

const addStore = async (req, res) => {
  const { body, user_data } = req;
  const { name, avatar, status } = body;

  if (!user_data.role == "Admin") {
    return res.status(401).json({ message: "Not Authorize" });
  }

  try {
    const store_data = {
      name,
    };
    const store_save = await Stores.create({
      ...store_data,
    });
    return res
      .status(200)
      .json({ message: "Store-Created", store: store_save });
  } catch (error) {
    return res.status(500).json({ message: "Error", error: error.message });
  }
};

const getStores = async (req, res) => {
  try {
    const stores = await Stores.find({ isDeleted: false });
    return res.status(200).json({ message: "Stores", stores: stores });
  } catch (error) {
    return res.status(500).json({ message: "Error", error: error.message });
  }
};

const updateStore = async (req, res) => {
  const { storeId } = req.params;
  const { body, user_data } = req;
  const { name, status } = body;

  // Ensure user is an Admin
  if (user_data.role !== "Admin") {
    return res.status(401).json({ message: "Not Authorized" });
  }

  try {
    // Update the store
    const store_update = await Stores.findByIdAndUpdate(
      storeId,
      { name, status },
      { new: true } // Return the updated document
    );

    if (!store_update) {
      return res.status(404).json({ message: "Store not found" });
    }

    return res.status(200).json({
      message: "Store updated successfully",
      store: store_update,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};

const deleteStore = async (req, res) => {
  const { storeId } = req.params;
  const { user_data } = req;

  // Ensure user is an Admin
  if (user_data.role !== "Admin") {
    return res.status(401).json({ message: "Not Authorized" });
  }

  try {
    // Mark the store as deleted
    const store_delete = await Stores.findByIdAndUpdate(
      storeId,
      { isDeleted: true },
      { new: true } // Return the updated document
    );

    if (!store_delete) {
      return res.status(404).json({ message: "Store not found" });
    }

    return res.status(200).json({
      message: "Store deleted successfully",
      store: store_delete,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};

const getStoreById = async (req, res) => {
  const { storeId } = req.params;

  try {
    // Find store by ID
    const store = await Stores.findOne({ _id: storeId, isDeleted: false });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    return res.status(200).json({
      message: "Store retrieved successfully",
      store: store,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};

const approveUser = async (req, res) => {
  const { body, user_data, user_id } = req;
  const { uid, approve_status } = body;

  if (!user_data.role == "Admin") {
    return res.status(401).json({ message: "Not Authorize" });
  }

  try {
    let user = await User_Auth_Schema.findOne({ _id: uid });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    user.approved_status = approve_status;
    await user.save();
    return res.status(200).json({ message: "User Approved", user: user });
  } catch (error) {
    return res.status(500).json({ message: "Error", error: error.message });
  }
};

// const addProducts = async (req, res) => {
//   const { body, user_data, user_id } = req;
//   const { name, image, category, store_id,type } = body;
//   if (!user_data.role == "Admin") {
//     return res.status(401).json({ message: "Not Authorize" });
//   }
//   if (!name || !category || !image) {
//     if(!store_id )
//     {
//       return res.status(400).json({message:"If Type is single you must give  store id" });

//     }
//     return res.status(400).json({ message: "Please fill all the fields" });
//   }
//   try {
//     const pid = generateUniquePid();
//     let st = (!store_id) ? null:store_id
//     const product_data = {
//       name,
//       image,
//       category,
//       store_id:st,
//       status: "Active",
//       pid,
//       type
//     };
//     // return res.json({msg:true})
//     const product_save = await Products.create({
//       ...product_data,
//     });
//     return res
//       .status(200)
//       .json({ message: "Product-Created", store: product_save });
//   } catch (error) {
//     return res.status(500).json({ message: "Error", error: error.message });
//   }
// };


const addProducts = async (req, res) => {
  const { body, user_data } = req;
  const { name, image, category, store_id, type } = body;

  // Check if the user is an admin
  if (user_data.role !== "Admin") {
    return res.status(401).json({ message: "Not Authorized" });
  }

  // Validate required fields
  if (!name || !category || !image) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  // If type is "Single," ensure store_id is provided
  if (type === "Single" && !store_id) {
    return res.status(400).json({ message: "If Type is 'Single,' you must provide a store ID" });
  }

  try {
    const pid = generateUniquePid();
    const products = [];

    if (type === "All") {
      // Fetch all active stores that are not deleted
      const stores = await Stores.find({ isDeleted: false, status: "Active" });

      if (!stores || stores.length === 0) {
        return res.status(404).json({ message: "No active stores found" });
      }

      // Create a product for each active store
      for (const store of stores) {
        const product_data = {
          name,
          image,
          category,
          store_id: store._id,
          status: "Active",
          pid,
          type
        };

        const product_save = await Products.create(product_data);
        products.push(product_save);
      }
    } else {
      // If type is "Single," create a product for the specified store
      const product_data = {
        name,
        image,
        category,
        store_id,
        status: "Active",
        pid,
        type
      };

      const product_save = await Products.create(product_data);
      products.push(product_save);
    }

    // Return the created products
    return res.status(200).json({
      message: "Product(s) Created Successfully",
      data: products
    });

  } catch (error) {
    // Handle any errors during the process
    return res.status(500).json({
      message: "Error creating products",
      error: error.message
    });
  }
};

const editProduct = async (req, res) => {
  const { body, params, user_data } = req;
  const { name, image, category, store_id, status,type } = body;
  const { pid } = params;

  if (user_data.role !== "Admin") {
    return res.status(401).json({ message: "Not Authorized" });
  }

  if (!pid) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    // Find the product by PID
    const product = await Products.findOne({ pid: pid });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update product fields if they are provided
    if (name) product.name = name;
    if (image) product.image = image;
    if (category) product.category = category;
    if (store_id) product.store_id = store_id;
    if(type) product.type = type;

    // Save the updated product
    await product.save();

    return res
      .status(200)
      .json({ message: "Product updated successfully", product });
  } catch (error) {
    return res.status(500).json({ message: "Error", error: error.message });
  }
};

const updateProducts = async (req, res) => {
  try {
    const result = await Products.updateMany(
      {},
      { $set: { status: "Active" } }
    );
    return res.status(200).json({ message: "Products" });
  } catch (error) {
    return res.status(500).json({ message: "Error", error: error.message });
  }
};

const getProducts = async (req, res) => {
  const { params, user_data } = req;
  const { store_id } = params;
  console.log(user_data.store_id);
  try {
    let products;
    if (store_id) {
      products = await Products.find({
        store_id: store_id,
        status: { $ne: "In-Active" },
      }).populate("store_id");
    } else {
      if (user_data.store_id) {
        products = await Products.find({
          store_id: user_data.store_id,
          status: { $ne: "In-Active" },
        }).populate("store_id");
      } else {
        products = await Products.find({
          status: { $ne: "In-Active" },
        }).populate("store_id");
      }
    }

    return res.status(200).json({ message: "Products", products });
  } catch (error) {
    return res.status(500).json({ message: "Error", error: error.message });
  }
};

const singleProduct = async (req, res) => {
  const { body, params, user_data } = req;
  const { pid } = params;

  try {
    const product = await Products.findOne({ pid: pid }).populate("store_id");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product found", product });
  } catch (error) {
    return res.status(500).json({ message: "Error", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const { body, params, user_data } = req;
  const { pid } = params;
  try {
    const product = await Products.findOne({ pid: pid });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.status = "In-Active";
    await product.save();
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error", error: error.message });
  }
};
module.exports = {
  addStore,
  getStores,
  approveUser,
  addProducts,
  editProduct,
  getProducts,
  singleProduct,
  deleteProduct,
  adminDashboard,
  updateProducts,
  updateStore,
  deleteStore,
  getStoreById,
};
