import { Request, RequestHandler, Response } from "express";
import { userRepository } from "../Repositories";
import { QueryFailedError } from "typeorm";

const register: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { firstName, email, password } = req.body;

    // Input validation
    if (!firstName || !email || !password) {
        res.status(400).json({
            success: false,
            message: "Missing required fields"
        });
    }

    try {
        const user = userRepository.create({ firstName, email, password });
        const registeredUser = await userRepository.save(user);

        res.status(201).json({
            success: true,
            message: "User registered successfully!",
            user: {
                id: registeredUser.id,
                firstName: registeredUser.firstName,
                email: registeredUser.email
            }
        });
    } catch (error) {
        if (error instanceof QueryFailedError) {
            // Handle duplicate email error
            if (error.message.includes('duplicate key value violates unique constraint')) {
                res.status(409).json({
                    success: false,
                    message: "Email already exists"
                });
            }
        }

        console.error("Error registering user:", error);
        res.status(500).json({
            success: false,
            message: "Error registering user"
        });
    }
};

const getAllUsers: RequestHandler = async (req: Request, res: Response): Promise<void> => {

    try {
        const users = await userRepository.find();

        res.status(200).json({
            success: true,
            message: "User registered successfully!",
            user: users
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({
            success: false,
            message: "Error getting users"
        });
    }
};




export const userController = {
    register,
    getAllUsers
};