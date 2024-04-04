const v2 = require("cloudinary");
const fs = require("fs");

v2.config({
  cloud_name: "djzoxoaqq",
  api_key: "633315643438167",
  api_secret: "8qfHdzCW5JipcZsb7MnoW42nmow",
});

exports.uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }
    const respose = await v2.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("file uploaded successfully", respose.url);
    fs.unlinkSync(localFilePath);
    return respose;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};
