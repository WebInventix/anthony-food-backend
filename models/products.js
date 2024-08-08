const mongoose = require('mongoose');

const { Schema } = mongoose;
const Products = mongoose.model('products', new Schema({
    name: {
        type: String,
        required: false
    },
    pid: {
        type: String,
        required: true
    },
    category:{
        type: String,
        enum:['Vegetables','Fruits'],
        required:true
    },
    image: {
        type: String,
        required: true
    },
    
    store_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stores',
        default:null,
    },
    status: {
        type: String,
        enum:['Active','In-Active'],
        required:true
    }


          
}, { timestamps: true }
))


module.exports = { Products }
