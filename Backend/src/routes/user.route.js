import { Router } from "express";
import { imageUpload, resizeImageFromUrl } from "../controllers/imageUpload.controller.js";
import { upload } from "../middlewares/multer.middleware.js";




const router = Router()


router.route("/upload").post(upload.single("image"),imageUpload)
router.route("/resize").put(resizeImageFromUrl)


export default router;