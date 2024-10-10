import multer from "multer";
import { v4 as uuidv4 } from "uuid"; // to generate unique IDs
import path from "path"; // to extract file extensions

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    // Add unique identifier to the original filename to avoid overwriting
    const uniqueSuffix = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage });
