import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File size limit exceeded (max: 5MB).' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ message: 'Too many files. Maximum is 5.' });
        }
        return res.status(400).json({ message: 'File upload error.' });
    }

    if (err.message === 'Invalid file type. Only JPEG, PNG and PDF are allowed.') {
        return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: 'Internal server error.' });
};

