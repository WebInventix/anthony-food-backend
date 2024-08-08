const express = require("express");
const { addStore,approveUser,addProducts,editProduct, getProducts,singleProduct, deleteProduct } = require('../../controllers/admin_controllers/index');
const { addVendor } = require('../../controllers/admin_controllers/vendormanagement')
const router = express.Router();


// router.post('/verify-user',  verfiyUser);
// router.post('/reset-password',  resetPassword);

router.post('/add-store', addStore)
router.post('/approve-user', approveUser)
router.post('/add-product', addProducts)
router.post('/edit-product/:pid', editProduct)
router.get('/get-products',getProducts)
router.get('/get-products/:store_id',getProducts)
router.get('/single-product/:pid',singleProduct)
router.delete('/delete-product/:pid', deleteProduct)
router.post('/add-vendor',addVendor)


module.exports = router;
