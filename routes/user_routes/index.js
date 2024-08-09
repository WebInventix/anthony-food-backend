const express = require("express");
const { addStore,approveUser,addProducts,editProduct, getProducts,singleProduct, deleteProduct } = require('../../controllers/admin_controllers/index');
const { addVendor,getVendor,deleteVendor } = require('../../controllers/admin_controllers/vendormanagement')
const { addUser, deleteUser, requestedUser, getUser } = require('../../controllers/admin_controllers/usermanagement')
const router = express.Router();


// router.post('/verify-user',  verfiyUser);
// router.post('/reset-password',  resetPassword);

router.post('/add-store', addStore)
router.post('/approve-decline-user', approveUser)
router.post('/add-product', addProducts)
router.post('/edit-product/:pid', editProduct)
router.get('/get-products',getProducts)
router.get('/get-products/:store_id',getProducts)
router.get('/single-product/:pid',singleProduct)
router.delete('/delete-product/:pid', deleteProduct)
router.post('/add-vendor',addVendor)
router.get('/get-vendor/:id',getVendor)
router.delete('/delete-vendor/:id',deleteVendor)
router.post('/add-user', addUser)
router.get('/get-user/:store', getUser)
router.delete('/delete-user/:id', deleteUser)
router.get('/requested-users-list/:id', requestedUser)

module.exports = router;
