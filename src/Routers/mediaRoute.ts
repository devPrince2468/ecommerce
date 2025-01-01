import express from "express";
import { mediaController } from "../Controllers/mediaController";
import { upload } from "../Config/multerConfig";

const mediaRoute = express.Router();

mediaRoute.post("/upload/single", upload.single('file'), mediaController.uploadSingle);
mediaRoute.post("/upload/multiple", upload.array('files', 10), mediaController.uploadMultiple);

export default mediaRoute;

