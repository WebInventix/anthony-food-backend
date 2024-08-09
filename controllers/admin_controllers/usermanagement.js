const mongoose = require('mongoose');
const { User_Auth_Schema } = require("../../models/user_auth_model");
const { Bcrypt_Service } = require("../../services/bcrypt_services");


const addUser = async (req,res) => {
    const { body, user_id } = req;
    try {
        const {
        email,
        password,
        phonenumber,
        store_id,
        role,
        approved_status
        } = body;
        // 2. if error in validation -> return error via middleware
        if(role=="User")
        {
        if(!email || !password || !phonenumber || !store_id)
            {
            return res.json({message:'Fill the required fields'},401)
            }
        }
        

        const is_email_exist = await User_Auth_Schema.exists({ email });
        if (is_email_exist) {
        const error = {
            status: 409,
            message: "User is already exist with this email!",
        };
        return next(error);
        }
        const secure_password = await Bcrypt_Service.bcrypt_hash_password(password);
        const store_user_data = {
        email,
        password: secure_password,
        phonenumber,
        store_id,
        role,
        approved_status
        };
        // return res.json({msg:true})
        const save_user = await User_Auth_Schema.create({
        ...store_user_data,
        });
        return res.json({message:"User created successfully",data:save_user})
    }
    catch (error) {
        return res.status(500).json({message:error.message})
        
    }
}

const deleteUser = async (req,res)=>{
    const {params} = req;
    const {id} = params;
    try {
        let nuser = await User_Auth_Schema.findById(id)
        if (!nuser) {
            return res.status(404).json({ message: "User Not Found" });
            }
            nuser.approved_status='Deleted';
        await nuser.save()
        return res.status(200).json({message:'User Deleted Successfully',nuser})


        
    } catch (error) {
        
        return res.status(500).json({message:error.message})
    }
}

const requestedUser = async (req,res) => {
    const {params} = req;
    const {id} = params;
    try {
        let nuser = await User_Auth_Schema.find({store_id:id,approved_status:'Requested'})
        return res.status(200).json({message:'Requested Users by Store',nuser})

        
    } catch (error) {
        return res.status(500).json({message:error.message})
        
    }
}
const getUser = async (req,res)=> {
    const{params} = req
    const{store} = params
    console.log(store)
    try {
        console.log(store,"try")
        let nuser = await User_Auth_Schema.find({store_id:store,approved_status:{ $ne: 'Deleted' }})
        return res.status(200).json({message:'User Found',users:nuser})

        
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }
}
module.exports = {
    addUser,
    deleteUser,
    requestedUser,
    getUser
};
