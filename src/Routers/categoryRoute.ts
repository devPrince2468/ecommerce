import express from "express"
import { categoryController } from "../Controllers/categoryController";
import { auth } from "../Middlewares/auth";


const categoryRoute = express.Router()

categoryRoute.post("/add", auth, categoryController.addCategory);
categoryRoute.get("/get", auth, categoryController.getAllCategory);
categoryRoute.get("/get/:id", auth, categoryController.getOne);
categoryRoute.delete("/remove", auth, categoryController.removeCategory);
categoryRoute.put("/update/:id", auth, categoryController.updateCategory);


export default categoryRoute

