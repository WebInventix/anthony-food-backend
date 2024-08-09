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
    }


          
}, { timestamps: true }
))


module.exports = { Vendors }
