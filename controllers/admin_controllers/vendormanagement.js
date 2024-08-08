const mongoose = require('mongoose');
const { Vendors } = require("../../models/vendors");
const { Stores } = require("../../models/stores");
const { Products } = require("../../models/products");


const addVendor = async (req,res) => {
    const {body} = req;
    const {name,email,phonenumber,avatar,store_id,category,vproducts} = body
    try {
        let allproducts = vproducts;
        if (typeof vproducts === 'string') {
            productsArray = JSON.parse(vproducts);
        }

        const vendor = new Vendors({name,email,phonenumber,avatar,store_id,category,status:'Active',allproducts})
        await vendor.save()
        res.status(200).json({message:'Vendor Added Successfully',vendor})
        
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }
}

module.exports = {
    addVendor
};
