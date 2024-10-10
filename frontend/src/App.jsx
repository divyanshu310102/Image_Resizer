import { useState } from "react";
import axios from "axios";
import { Upload, Crop } from "lucide-react"; // Icons from Lucide

function App() {
  const [image, setImage] = useState(null); // For storing the selected image
  const [uploadedImage, setUploadedImage] = useState(null); // URL of the uploaded image
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [resizedImage, setResizedImage] = useState(null); // URL of the resized image

  // Handle image upload
  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please select an image to upload!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:8000/user/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(response)

      setUploadedImage(response.data.data.image); // Assuming the server returns the image URL
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // Handle image resizing
  const handleResizeImage = async (e) => {
    e.preventDefault();

    console.log(uploadedImage)

    if (!uploadedImage || (!width && !height)) {
      alert("Please upload an image and provide dimensions for resizing.");
      return;
    }

    try {
      const response = await axios.put("http://localhost:8000/user/resize", {
        image: uploadedImage,
        width,
        height,
      });

      console.log(response)

      setResizedImage(response.data.data);
    } catch (error) {
      console.error("Error resizing image:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Image Resizer</h1>

      {/* Image Upload Section */}
      <form
        className="mb-8 bg-white shadow p-6 rounded-lg w-full max-w-md"
        onSubmit={handleImageUpload}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Image</h2>
        <label className="block mb-4">
          <span className="text-gray-700">Select Image:</span>
          <input
            type="file"
            accept="image/*"
            className="mt-2 block w-full"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2"
        >
          <Upload className="w-5 h-5" />
          Upload Image
        </button>
      </form>

      {/* Display Uploaded Image */}
      {uploadedImage && (
        <div className="bg-white shadow p-6 rounded-lg w-full max-w-md text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Uploaded Image</h2>
          <img
            src={uploadedImage}
            alt="Uploaded"
            className="w-full h-auto border border-gray-300 rounded"
          />
        </div>
      )}

      {uploadedImage && (
        <>
          {/* Image Resize Section */}
          <form
            className="mb-8 bg-white shadow p-6 rounded-lg w-full max-w-md"
            onSubmit={handleResizeImage}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Resize Image</h2>
            <div className="flex gap-4 mb-4">
              <label className="flex-1">
                <span className="text-gray-700">Width (px):</span>
                <input
                  type="number"
                  className="mt-2 block w-full border border-gray-300 rounded p-2"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                />
              </label>
              <label className="flex-1">
                <span className="text-gray-700">Height (px):</span>
                <input
                  type="number"
                  className="mt-2 block w-full border border-gray-300 rounded p-2"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <Crop className="w-5 h-5" />
              Resize Image
            </button>
          </form>

          {/* Display resized image */}
          {resizedImage && (
            <div className="bg-white shadow p-6 rounded-lg w-full max-w-md text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Resized Image</h2>
              <img
                src={resizedImage}
                alt="Resized"
                className="w-full h-auto border border-gray-300 rounded"
              />
              <a
                href={resizedImage}
                download="resized_image.webp"
                className="block mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                Download Resized Image
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
