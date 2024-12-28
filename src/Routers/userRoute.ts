import express from "express"
import { userController } from "../Controllers/userController"


const userRoute = express.Router()

userRoute.post("/register", userController.register);
userRoute.get("/get-all-users", userController.getAllUsers);


export default userRoute

