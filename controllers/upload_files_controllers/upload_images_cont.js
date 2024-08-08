const cloudinary = require('cloudinary').v2;
const { unique_id } = require("../../utils/common_functions/unique_id");
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET_KEY } = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_SECRET_KEY,
});

const upload_image_contoller = async (req, res, next) => {
  const { files } = req;
  const request_file = files || null;
  try {
    if (!request_file) {
      return next({ status: 404, message: "file not found" });
    }
    const { binary_file } = request_file;

    const file_format = binary_file.name.split(".")[1];

    const file_type = binary_file.mimetype.split("/")[0];

    const binary_file_handle = await cloudinary.uploader.upload(
      binary_file.tempFilePath,
      {
        public_id: `${unique_id()}-${binary_file.name.split('.')[0]}`,
        resource_type: "auto",
      }
    );
    
    return res.status(200).send({
      success: true,
      message: "file successfully uploaded",
      url: binary_file_handle.secure_url,
      file_type,
      file_format,
      name: binary_file.name
    });
  } catch (error) {
    console.error("Error during file upload:", error);
    return next(error);
  }
};
module.exports = { upload_image_contoller };
