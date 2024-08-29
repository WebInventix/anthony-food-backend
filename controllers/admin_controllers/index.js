const mongoose = require('mongoose');
const crypto = require('crypto');
const { Stores } = require("../../models/stores");
const { User_Auth_Schema } = require("../../models/user_auth_model");
const { Products } = require("../../models/products");
const { Orders } = require("../../models/orders");


const adminDashboard = async (req,res) => {
    const { params } = req;
    const { store_id } = params;
    try {
        let orders,recentUser;
        if(store_id)
        {
            orders = await Orders.find({ store_id: store_id })
            .populate("store_id")
            .populate('user_id')
            .populate('product_id')
            .sort({ _id: -1 });

            recentUser = await User_Auth_Schema.findOne({store_id: store_id,approved_status:'Requested'})
            .sort({_id:-1})
        }
        let data = {orders:orders,user:recentUser}
        
        return res.status(200).json({message:"Dashboard",data})
        
    } catch (error) {
        return res.status(500).json({message:"Error",error:error.message})
        
    }


}

const generateUniquePid = () => {
    const uniqueId = crypto.randomBytes(3).toString('hex'); // Generates a random 6-character hex string
    return `PID${uniqueId}`;
};

const addStore = async (req,res) => {
    const {body,user_data,user_id} = req;
    const {name,avatar,status} = body;
    
    if(!user_data.role=="Admin")
    {
        return res.status(401).json({message:"Not Authorize"})
    }

    try {
        
        const store_data = {
            name,
            avatar,
            status
          };
          // return res.json({msg:true})
          const store_save = await Stores.create({
            ...store_data,
          });
          return res.status(200).json({message:"Store-Created",store:store_save})

    } catch (error) {
        return res.status(500).json({message:"Error",error:error.message})
    }
    
}

const getStores = async (req,res) => {
    try {
        const stores = await Stores.find();
        return res.status(200).json({message:"Stores",stores:stores})
        } catch (error) {
            return res.status(500).json({message:"Error",error:error.message})
            }
            
}

const approveUser = async (req,res) => {
    const {body,user_data,user_id} = req;
    const {uid,approve_status} = body;
    
    if(!user_data.role=="Admin")
    {
        return res.status(401).json({message:"Not Authorize"})
    }

    try {
        
    let user = await User_Auth_Schema.findOne({_id:uid});
    if(!user)
    {
        return res.status(404).json({message:"User Not Found"})
    }
    user.approved_status = approve_status;
    await user.save();
    return res.status(200).json({message:"User Approved",user:user})

    } catch (error) {
        return res.status(500).json({message:"Error",error:error.message})
    }

}

const addProducts = async (req,res) => {
    const {body,user_data,user_id} = req;
    const {name,image,category,store_id} = body;
    
    if(!user_data.role=="Admin")
    {
        return res.status(401).json({message:"Not Authorize"})
    }
    if(!name || !category || !image || !store_id)
    {
        return res.status(400).json({message:"Please fill all the fields"})
    }
    try {
        
        const pid = generateUniquePid();
        const product_data = {
            name,
            image,
            category,
            store_id,
            status:'Active',
            pid

          };
          // return res.json({msg:true})
          const product_save = await Products.create({
            ...product_data,
          });
          return res.status(200).json({message:"Product-Created",store:product_save})

    } catch (error) {
        return res.status(500).json({message:"Error",error:error.message})
    }
}


const editProduct = async (req, res) => {
    const { body, params, user_data } = req;
    const { name, image, category, store_id, status } = body;
    const { pid } = params;

    if (user_data.role !== "Admin") {
        return res.status(401).json({ message: "Not Authorized" });
    }

    if (!pid) {
        return res.status(400).json({ message: "Product ID is required" });
    }

    try {
        // Find the product by PID
        const product = await Products.findOne({ pid:pid });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Update product fields if they are provided
        if (name) product.name = name;
        if (image) product.image = image;
        if (category) product.category = category;
        if (store_id) product.store_id = store_id;

        // Save the updated product
        await product.save();

        return res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        return res.status(500).json({ message: "Error", error: error.message });
    }
};

const getProducts = async (req,res) => {
    const { params } = req;
    const { store_id } = params;
    try {
        let products;
        if(store_id)
        {
            products = await Products.find({store_id:store_id,status:'Active'}).populate("store_id");
        }
        else
        {
            products = await Products.find({status:'Active'}).populate("store_id");
        }
        
        return res.status(200).json({message:"Products",products})
        
    } catch (error) {
        return res.status(500).json({message:"Error",error:error.message})
        
    }
}

const singleProduct = async (req,res) => {
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
}

const deleteProduct = async (req,res) => {
    const { body, params, user_data } = req;
    const { pid } = params;
    try {
        const product = await Products.findOne({pid:pid})
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
            }
            product.status = "In-Active";
            await product.save();
            return res.status(200).json({ message: "Product deleted successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Error", error: error.message });
    }
}
module.exports = {
    addStore,
    getStores,
    approveUser,
    addProducts,
    editProduct,
    getProducts,
    singleProduct,
    deleteProduct,
    adminDashboard
};
