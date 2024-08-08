const mongoose = require('mongoose');

const { Schema } = mongoose;
const User_Auth_Schema = mongoose.model('user', new Schema({
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    phonenumber: {
        type: String,
        required: false
    },
    role:{
        type: String,
        enum:['User','Admin'],
        required:true
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
    approved_status: {
        type: String,
        enum:['Approved','Requested','Decline'],
        required:true
    }


          
}, { timestamps: true }
))


module.exports = { User_Auth_Schema }
