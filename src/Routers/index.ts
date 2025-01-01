import express from "express"
import userRoute from "./userRoute"
import categoryRoute from "./categoryRoute";
import subCategoryRoute from "./subCategoryRoute";
import productRoute from "./productRoute";
import mediaRoute from "./mediaRoute";


const router = express.Router()

router.use("/user", userRoute);
router.use("/category", categoryRoute);
router.use("/subCategory", subCategoryRoute);
router.use("/product", productRoute);
router.use("/media", mediaRoute);

export default router

