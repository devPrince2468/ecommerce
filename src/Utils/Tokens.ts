import jwt, { JwtPayload } from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = 'mZFU1Q17k1x2';
const REFRESH_TOKEN_SECRET = 'ZtHGAMs326qX';


const ACCESS_TOKEN_EXPIRATION = '2m';
const REFRESH_TOKEN_EXPIRATION = '1d';


interface TokenPayload {
    userId: string | number;
}

interface AccessAndRefreshToken {
    accessToken: string;
    refreshToken: string;
}


const generateAccessToken = async (userId: string | number): Promise<string> => {
    const payload: TokenPayload = { userId };

    return await jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRATION,
    });
};


const generateRefreshToken = async (userId: string | number): Promise<string> => {
    const payload: TokenPayload = { userId };

    return await jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRATION,
    });
};



// Function to verify the refresh token
const verifyRefreshToken = (token: string): JwtPayload | string | null => {
    try {
        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
        return decoded;
    } catch (error) {
        return null; // Invalid token
    }
};

const generateAccessTokenAndRefreshToken = async (userId: string | number): Promise<AccessAndRefreshToken> => {
    const accessToken = await generateAccessToken(userId);
    const refreshToken = await generateRefreshToken(userId);
    return { accessToken, refreshToken };
};

export { generateAccessToken, generateRefreshToken, verifyRefreshToken, generateAccessTokenAndRefreshToken };
