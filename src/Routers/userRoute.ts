import express from "express"
import { userController } from "../Controllers/userController"
import { auth } from "../Middlewares/auth";


const userRoute = express.Router()

userRoute.post("/register", userController.register);
userRoute.post("/login", userController.login);
userRoute.post("/logout", auth, userController.logout);
userRoute.get("/verify-user", userController.verifyUser);
userRoute.get("/get-all-users", userController.getAllUsers);
userRoute.delete("/remove-user", userController.removeUser);



export default userRoute

