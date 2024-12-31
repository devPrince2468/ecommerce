import express from "express"
import { categoryController } from "../Controllers/categoryController";


const categoryRoute = express.Router()

categoryRoute.post("/add", categoryController.addCategory);
categoryRoute.get("/get", categoryController.getAllCategory);
categoryRoute.get("/get/:id", categoryController.getOne);
categoryRoute.delete("/remove", categoryController.removeCategory);
categoryRoute.put("/update/:id", categoryController.updateCategory);


export default categoryRoute

