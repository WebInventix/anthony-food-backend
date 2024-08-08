const express = require('express');
const { register_user, login_user, verify_reset_password_OTP, reset_user_password_request, verify_OTP_and_create_password, } = require('../../controllers/auth_controllers');
const { upload_image_contoller } = require('../../controllers/upload_files_controllers/upload_images_cont.js');
const { getStores } = require('../../controllers/admin_controllers');
const router = express.Router()


router.post('/register',  register_user)
router.get('/get-stores', getStores)
router.post('/login', login_user)
router.post('/reset-password-req',  reset_user_password_request)
router.post('/reset-password-otp-verify',  verify_reset_password_OTP)
router.post('/reset-password-create',  verify_OTP_and_create_password)





router.post('/upload-files', upload_image_contoller)
// upload-files






module.exports = router