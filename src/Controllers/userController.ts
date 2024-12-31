import { Request, RequestHandler, Response } from "express";
import bcrypt from "bcryptjs";
import { userRepository } from "../Repositories";
import { QueryFailedError } from "typeorm";
import { transporter } from "../Utils/Mail";
import { v4 as uuidv4 } from 'uuid';
import { verificationMail } from "../Utils/MailTemplate";
import { RegisterUserRequest } from "../Interfaces/UserInterface";
import { generateAccessToken, generateAccessTokenAndRefreshToken, generateRefreshToken } from "../Utils/Tokens";


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
    const { email, verificationCode } = req.query;
    try {

        // Input validation
        if (!email || !verificationCode || typeof email !== "string") {
            res.status(400).json({
                success: false,
                message: 'Email and verification code are required'
            });
            return;
        }

        const user = await userRepository.findOne({
            where: { email: email },
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
        const response = await userRepository.update(
            { id: user.id },
            {
                isVerified: true,
                verificationCode: "",
                updated_at: new Date(),
                created_at: user.created_at
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

const setTokensAndCookies = (res: Response, accessToken: string, refreshToken: string) => {
    const options = {
        httpOnly: true,
        secure: true
    };
    res.cookie("accessToken", accessToken, options);
    res.cookie("refreshToken", refreshToken, options);
};

const login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    let statusCode = 200;
    let responseBody = {
        success: true,
        message: "Logged in successfully",
        token: null as { accessToken: string; refreshToken: string } | null
    };

    try {
        if (!email || !password) {
            statusCode = 400;
            responseBody = {
                success: false,
                message: "Email and Password are required",
                token: null
            };
        } else {
            const user = await userRepository.findOne({ where: { email } });

            if (!user) {
                statusCode = 404;
                responseBody = {
                    success: false,
                    message: "User does not exist",
                    token: null
                };
            } else {
                const isPasswordValid = await bcrypt.compare(password, user.password);

                if (isPasswordValid) {
                    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user.id);
                    user.refreshToken = refreshToken;
                    await userRepository.save(user);

                    setTokensAndCookies(res, accessToken, refreshToken);

                    responseBody.token = { accessToken, refreshToken };
                } else {
                    statusCode = 401;
                    responseBody = {
                        success: false,
                        message: "Incorrect Password!",
                        token: null
                    };
                }
            }
        }
    } catch (error) {
        console.error("Login error", error);
        statusCode = 500;
        responseBody = {
            success: false,
            message: "An error occurred during login",
            token: null
        };
    }

    res.status(statusCode).json(responseBody);
};

interface CustomRequest extends Request {
    user?: {
        id: string | number;
        email: string;
    };
}


const logout = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(400).json({ success: false, message: "User ID not found" });
        }


        const result = await userRepository.update({ id: userId }, { refreshToken: undefined });

        if (result.affected === 0) {
            res.status(404).json({ success: false, message: "User not found" });
        }


        res.clearCookie('accessToken', { httpOnly: true, secure: true });
        res.status(200).json({ success: true, message: "Logged out successfully" });

    } catch (error) {
        console.error("Error logging out", error);
        res.status(500).json({ success: false, message: "Failed to log out" });
    }
};




export const userController = {
    register,
    getAllUsers,
    removeUser,
    verifyUser,
    login,
    logout
};