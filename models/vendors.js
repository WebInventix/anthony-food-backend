const { required } = require('joi');
const mongoose = require('mongoose');

const { Schema } = mongoose;
const Vendors = mongoose.model('vendors', new Schema({
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    phonenumber: {
        type: String,
        required: false
    },
    avatar:{
        type: String,
        required:false
    },
    store_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stores',
        default:null,
        required:false
    },
    category: {
        type: String,
        enum:['Vegetables','Fruits'],
        required:true
    },
    allproducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: false // Set required to false
    }],
    status: {
        type: String,
        enum:['Active','In-Active','Deleted'],
        required:true
    },
    type:{
        type:String,
        enum:['Single','All'],
        default:'Single',
        required:false
    }


          
}, { timestamps: true }
))


module.exports = { Vendors }
