import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFileToCloudinary } from "../utils/cloudinary.js";
import axios from 'axios'
import sharp from 'sharp'
import fs from 'fs'


const imageUpload = asyncHandler(async (req, res) => {


    if (!req.file) {
        throw new ApiError(400, "File not found!!");
      }


    const localFilePath = req.file.path;

    const image = await uploadFileToCloudinary(localFilePath);

    if (!image) {
        throw new ApiError(500, "File upload to Cloudinary failed.")
      }


      const uploadedImage = await User.create({
        image:image.url
      })

      const newImage = await User.findById(uploadedImage._id)

      console.log(newImage.image)

      if(!newImage){
        throw new ApiError(500, "Image not uploaded!!")
      }

      

      return res.status(200)
      .json(
        new ApiResponse(200,  newImage, "Image uploaded successfully")

      )


})




const resizeImageFromUrl = asyncHandler(async (req, res) => {

  
  const { image, width, height } = req.body;

  if (!(image || width || height)) {
    throw new ApiError(400, "All fields are required!!");
  }

  // const imageSource = await User.findById(image);

  // console.log(imageSource.image);

  // const imageUrl = imageSource.image;

  // if (!imageUrl) {
  //   throw new ApiError(404, "ImageUrl required!!");
  // }

  let imageBuffer;

  try {
    const response = await axios.get(image, {
      responseType: 'arraybuffer', 
    });
    imageBuffer = Buffer.from(response.data, 'binary');
  } catch (error) {
    throw new ApiError(400, "Failed to fetch the image from the URL.");
  }
  
  // console.log(imageBuffer);

  // Resize the image using sharp
  const resizedImageBuffer = await sharp(imageBuffer)
    .resize({
      width: width ? parseInt(width) : undefined,
      height: height ? parseInt(height) : undefined,
    })
    .toBuffer();

  console.log(resizedImageBuffer);

  // Save the resized image to a temporary location
  const outputPath = "./public/temp/resized.webp";
  await fs.promises.writeFile(outputPath, resizedImageBuffer);

  // Upload the resized image to Cloudinary

  const resizedImage = await uploadFileToCloudinary(outputPath)

  if(!resizedImage){
    throw new ApiError(500, "Upload failed!!")
  }

  console.log(resizedImage)

 

 

  // Return the resized image buffer in the response
  return res.status(200).json(
    new ApiResponse(200, resizedImage.url, "Resized Successfully!!")
  );
});

  
   





export {imageUpload, resizeImageFromUrl}