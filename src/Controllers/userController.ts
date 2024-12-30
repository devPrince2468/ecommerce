import { Request, RequestHandler, Response } from "express";
import bcrypt from "bcryptjs";
import { userRepository } from "../Repositories";
import { QueryFailedError } from "typeorm";
import { User } from "../Entities/User";
import { transporter } from "../Utils/Mail";
import nodemailer from "nodemailer"
import { v4 as uuidv4 } from 'uuid';

const register: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { firstName, email, password } = req.body;
    // Input validation
    if (!firstName || !email || !password) {
        res.status(400).json({
            success: false,
            message: "Missing required fields"
        });
        return;
    }
   
    try {
        // Create user instance
        const user = new User();
        user.firstName = firstName?.trim();
        user.email = email?.trim().toLowerCase();
        user.password = password;
        user.verificationCode = uuidv4();

        // Validate user entity
        await user.validate();

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(password, salt);
        user.password = securePassword;

        // Message object
        let message = {
            from: 'prince.dev2468@gmail.com',
            to: email,
            subject: 'Nodemailer is unicode friendly ✔',
            text: 'Hello to myself!',
            html: `<p><b>Hello</b> ${user.verificationCode} to myself!</p>`
        };



        // Save user
        const registeredUser = await userRepository.save(user);

        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log('Error occurred. ' + err.message);
                return process.exit(1);
            }

            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });

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
                return;
            }
        }

        if (error instanceof Array) {
            // Handle validation errors
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error
            });
            return;
        }

        console.error("Error registering user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error occurred during registration"
        });
    }
};

const getAllUsers: RequestHandler = async (req: Request, res: Response): Promise<void> => {

    try {
        const users = await userRepository.find();

        res.status(200).json({
            success: true,
            user: users
        });
    } catch (error) {
        console.error("Error getting user:", error);
        res.status(500).json({
            success: false,
            message: "Error getting users"
        });
    }
};

const removeUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.body;
    try {
        const users = await userRepository.delete(id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully!",
            user: users
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting user"
        });
    }
};




export const userController = {
    register,
    getAllUsers,
    removeUser
};