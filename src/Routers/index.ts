import express from "express"
import userRoute from "./userRoute"
import categoryRoute from "./categoryRoute";
import subCategoryRoute from "./subCategoryRoute";
import productRoute from "./productRoute";


const router = express.Router()

router.use("/user", userRoute);
router.use("/category", categoryRoute);
router.use("/subCategory", subCategoryRoute);
router.use("/product", productRoute);

export default router

