const mongoose = require('mongoose');
const { Vendors } = require("../../models/vendors");


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


const getVendor = async (req,res) => {
    const {params} = req;
    const {id} = params;
    try {
        const vendor = await Vendors.find({store_id:id,status:{ $ne: 'Deleted' }}).populate('store_id').populate('category').populate('allproducts')
        res.status(200).json({message:'Vendor Fetched Successfully',vendor})
        
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }
}


const deleteVendor = async (req,res) => {
    const {params} = req;
    const {id} = params;
    try {
        let vendor = await Vendors.findById(id)
        if (!vendor) {
            return res.status(404).json({ message: "Vendor Not Found" });
            }
        vendor.status='Deleted';
        await vendor.save()
        res.status(200).json({message:'Vendor Deleted Successfully',vendor})


        
    } catch (error) {
        
        res.status(500).json({message:error.message})
    }

}
module.exports = {
    addVendor,
    getVendor,
    deleteVendor
};
