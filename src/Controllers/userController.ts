import { Request, RequestHandler, Response } from "express";
import bcrypt from "bcryptjs";
import { userRepository } from "../Repositories";
import { QueryFailedError } from "typeorm";
import { transporter } from "../Utils/Mail";
import { v4 as uuidv4 } from 'uuid';
import { verificationMail } from "../Utils/MailTemplate";
import { RegisterUserRequest } from "../Interfaces/UserInterface";


const VERIFICATION_ERRORS = {
    USER_NOT_FOUND: 'User not found',
    ALREADY_VERIFIED: 'User already verified',
    INVALID_CODE: 'Invalid verification code',
    CODE_EXPIRED: 'Verification code has expired',
    SERVER_ERROR: 'Error verifying user'
} as const;

const register: RequestHandler = async (req: Request<{}, {}, RegisterUserRequest>, res: Response): Promise<void> => {
    const { firstName, email, password } = req.body;
    const verificationCode = uuidv4();
    const verificationCodeExpires = new Date(Date.now() + 2 * 60 * 1000);
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
        const user = userRepository.create({
            email,
            firstName,
            password,
            verificationCode,
            verificationCodeExpires,
        });

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
            html: verificationMail(verificationCode)
        };


        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log('Error occurred. ' + err.message);
                return process.exit(1);
            }
            console.log('Message sent: %s', info);
        });

        // Save user
        const registeredUser = await userRepository.save(user);


        res.status(201).json({
            success: true,
            message: "User registered successfully!",
            user: {
                id: registeredUser.id,
                firstName: registeredUser.firstName,
                email: registeredUser.email,
                verificationCode: registeredUser.verificationCode,
                verificationCodeExpires: registeredUser.verificationCodeExpires,
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

const verifyUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { email, verificationCode } = req.params;
    try {
        // const user = await userRepository.findOne({ where: { email: email } });

        // Input validation
        if (!email || !verificationCode) {
            res.status(400).json({
                success: false,
                message: 'Email and verification code are required'
            });
            return;
        }

        const user = await userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'isVerified', 'verificationCode', 'verificationCodeExpires']
        });

        if (!user) {
            res.status(404).json({
                success: false,
                message: VERIFICATION_ERRORS.USER_NOT_FOUND
            });
            return;
        }

        // Check verification status
        if (user.isVerified) {
            res.status(400).json({
                success: false,
                message: VERIFICATION_ERRORS.ALREADY_VERIFIED
            });
            return;
        }

        // Validate verification code
        if (user.verificationCode !== verificationCode) {
            res.status(400).json({
                success: false,
                message: VERIFICATION_ERRORS.INVALID_CODE
            });
            return;
        }

        // Check expiration
        if (new Date() > user.verificationCodeExpires) {
            res.status(400).json({
                success: false,
                message: VERIFICATION_ERRORS.CODE_EXPIRED
            });
            return;
        }

        // Update user verification status
        await userRepository.update(
            { id: user.id },
            {
                isVerified: true,
                verificationCode: "",
                verificationCodeExpires: ""
            }
        );

        res.status(200).json({
            success: true,
            message: "User verified successfully",
            data: {
                email: user.email,
                isVerified: true
            }
        });
    } catch (error) {
        console.error("Error verifying user", error);
        res.status(500).json({
            success: false,
            message: VERIFICATION_ERRORS.SERVER_ERROR
        });
    }
};




export const userController = {
    register,
    getAllUsers,
    removeUser,
    verifyUser
};