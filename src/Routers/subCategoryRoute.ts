import express from "express"
import { subcategoryController } from "../Controllers/subCategoryController";
import { auth } from "../Middlewares/auth";


const subCategoryRoute = express.Router()

subCategoryRoute.post("/add", auth, subcategoryController.addSubcategory);
subCategoryRoute.get("/get", auth, subcategoryController.getAllSubcategories);
subCategoryRoute.get("/get/:id", auth, subcategoryController.getOneSubcategory);
subCategoryRoute.delete("/remove", auth, subcategoryController.removeSubcategory);
subCategoryRoute.put("/update/:id", auth, subcategoryController.updateSubcategory);


export default subCategoryRoute

