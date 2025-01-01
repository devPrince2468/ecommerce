import express from "express"
import { auth } from "../Middlewares/auth";
import { productController } from "../Controllers/productController";


const productRoute = express.Router()

productRoute.post("/add", auth, productController.createProduct);
productRoute.get("/get", auth, productController.getAllProducts);
productRoute.get("/get/:id", auth, productController.getProductById);
productRoute.delete("/remove", auth, productController.deleteProduct);
productRoute.put("/update/:id", auth, productController.updateProduct);


export default productRoute

