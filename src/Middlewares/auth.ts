import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../Utils/ApiResponse";
import { userRepository } from "../Repositories";
import jwt, { JwtPayload } from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = 'mZFU1Q17k1x2';

interface CustomRequest extends Request {
    user?: {
        id: string | number;
        email: string;
    };
}

export const auth = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies?.accessToken || req.headers?.authorization?.replace("Bearer", "").trim();

        if (!token) {
            console.log("!token");
            res.status(401).json({ success: false, message: "Unauthorized request" });
            return
        }

        let decodedToken: JwtPayload | string | undefined;
        try {
            decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                res.status(401).json({ success: false, message: "Token has expired" });
                return
            }
            res.status(401).json({ success: false, message: "Invalid or expired token" });
            return
        }

        if (decodedToken && typeof decodedToken !== 'string' && 'userId' in decodedToken) {
            const user = await userRepository.findOne({ where: { id: decodedToken.userId } });

            if (!user) {
                console.log("!user");
                res.status(404).json({ success: false, message: "User not found" });
                return
            }

            req.user = {
                id: user.id,
                email: user.email,
            };
            return next();
        } else {
            console.log("Invalid token payload");
            res.status(401).json({ success: false, message: "Invalid token payload" });
            return
        }

    } catch (error) {
        console.log("Error", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
        return
    }
};
