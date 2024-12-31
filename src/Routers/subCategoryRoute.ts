import express from "express"
import { subcategoryController } from "../Controllers/subCategoryController";


const subCategoryRoute = express.Router()

subCategoryRoute.post("/add", subcategoryController.addSubcategory);
subCategoryRoute.get("/get", subcategoryController.getAllSubcategories);
subCategoryRoute.get("/get/:id", subcategoryController.getOneSubcategory);
subCategoryRoute.delete("/remove", subcategoryController.removeSubcategory);
subCategoryRoute.put("/update/:id", subcategoryController.updateSubcategory);


export default subCategoryRoute

