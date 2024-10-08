const express = require("express");
const {
  adminDashboard,
  addStore,
  approveUser,
  addProducts,
  editProduct,
  getProducts,
  updateProducts,
  singleProduct,
  deleteProduct,
} = require("../../controllers/admin_controllers/index");
const {
  addVendor,
  getVendor,
  deleteVendor,
} = require("../../controllers/admin_controllers/vendormanagement");
const {
  addUser,
  deleteUser,
  requestedUser,
  getUser,
  getChatUser,
} = require("../../controllers/admin_controllers/usermanagement");
const {
  orderRequest,
  getOrders,
  updateProfile,
  getAdmin,
} = require("../../controllers/user_controllers");
const {
  getAdminOrders,
  viewOrders,
  updateOrder,
  updateMultipleOrders,
} = require("../../controllers/admin_controllers/ordermanagement");
const router = express.Router();

// router.post('/verify-user',  verfiyUser);
// router.post('/reset-password',  resetPassword);

router.post("/add-store", addStore);
router.post("/approve-decline-user", approveUser);
router.post("/add-product", addProducts);
router.post("/edit-product/:pid", editProduct);
router.get("/get-products", getProducts);

router.get("/get-products/:store_id", getProducts);
router.get("/single-product/:pid", singleProduct);
router.delete("/delete-product/:pid", deleteProduct);
router.post("/add-vendor", addVendor);
router.get("/get-vendor/:id", getVendor);
router.delete("/delete-vendor/:id", deleteVendor);
router.post("/add-user", addUser);
router.get("/get-user/:store", getUser);
router.delete("/delete-user/:id", deleteUser);
router.get("/requested-users-list/:id", requestedUser);
router.post("/request-order", orderRequest);
router.get("/get-my-orders", getOrders);
router.post("/update-profile", updateProfile);
router.get("/get-admin-orders", getAdminOrders);
router.get("/get-admin-orders/:store", getAdminOrders);
router.get("/get-admin-orders/:store/:vendor", getAdminOrders);
router.get("/view-order/:order", viewOrders);
router.post("/update-order", updateOrder);
router.put("/update-multiple-orders", updateMultipleOrders);
router.get("/admin-dashboard/:store_id", adminDashboard);
router.get("/get-admin", getAdmin);
router.get("/get-chat-users", getChatUser);

module.exports = router;
