const { required } = require('joi');
const mongoose = require('mongoose');

const { Schema } = mongoose;
const Orders = mongoose.model('orders', new Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true,
    },
    store_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stores',
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vendors',
        required:false,
        default:null,
    },
    quantity: {
        type: String,
        required: true,
    },
    date:{
        type: Date,
        required:true
    },
    delivery_type: {
        type: String,
        enum:['Urgent','Normal'],
        required:true,
        default: 'Normal'
    },
    comment: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum:['In-Process','Delivered','Declined'],
        required:true,
        default: 'In-Process'
    }


          
}, { timestamps: true }
))


module.exports = { Orders }
