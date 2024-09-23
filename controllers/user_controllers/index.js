const { User_Auth_Schema } = require("../../models/user_auth_model");
const { Orders } = require("../../models/orders");
const { Products } = require("../../models/products");
 
const updateProfile = async (req,res) => {
    const {body, user_id} = req
    const {name,email,phonenumber,store_id,avatar} = body
    try 
    {
        let newData = {name,email,store_id,phonenumber,avatar}
        const updatedata = {...newData}
        const update = await User_Auth_Schema.findByIdAndUpdate(user_id,
            {$set:updatedata},
            { new: true, runValidators: true }
        )
        if(!update)
        {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.status(200).json({message: "Profile Updated Successfully", data: update})
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
      }
    
} 

const orderRequest = async (req,res) => {
    const {body, user_id} = req
    const {product_id,quantity,date,delivery_type,comment} = body
    try {
        const product = await Products.findById(product_id)
        if(!product)
            {
                return res.status(404).json({ message: "Product not found" });
            }
        const store_id = product.store_id
        const order = await Orders.create({store_id,product_id,quantity,date,delivery_type,user_id,status:'In-Process',comment})
        res.status(200).json({message: "Order Requested Successfully", data: order})
        
    } catch (error) {
        return res.status(500).json({ message: error.message });
        
    }
}

const getOrders = async (req,res) => {
    const { body,user_id } = req
    try {
        console.log(user_id)
        const orders = await Orders.find({ user_id:user_id}).populate('store_id').populate('product_id').populate('vendor_id')
        let data={allorders:orders,vegetables:[],fruits:[]};
        orders.map((or)=>{
            if(or.product_id.category === 'Vegetables'){
                data.vegetables.push(or)
            }
            else
            {
                data.fruits.push(or)

            }
        })
        return res.status(200).json({message: "Orders Retrieved Successfully", data: data})
        
    } catch (error) {
        return res.status(500).json({ message: error.message });
        
    }
}

const getAdmin = async (req,res) => {
    const admin = await User_Auth_Schema.findOne({role:'Admin'}).select('-password')
    let data=[]
    data[0] = admin
    return res.status(200).json({message: "Admin Retrieved Successfully", data: data})
}
module.exports = {
    updateProfile,
    orderRequest,
    getOrders,
    getAdmin

};
