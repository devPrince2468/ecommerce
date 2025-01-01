import { Request, RequestHandler, Response } from 'express';


const uploadSingle: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded.' });
        } else {
            res.status(200).json({
                message: 'File uploaded successfully',
                file: {
                    filename: req.file.filename,
                    originalname: req.file.originalname,
                    path: req.file.path,
                    size: req.file.size
                }
            });
        }

    } catch (error) {
        console.error('Error in uploadSingle:', error);
        res.status(500).json({ message: 'An error occurred while uploading the file.' });
    }
}

const uploadMultiple: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
            res.status(400).json({ message: 'No files uploaded.' });
        }

        const fileInfos = (req.files as Express.Multer.File[]).map(file => ({
            filename: file.filename,
            originalname: file.originalname,
            path: file.path,
            size: file.size
        }));

        res.status(200).json({
            message: 'Files uploaded successfully',
            files: fileInfos
        });
    } catch (error) {
        console.error('Error in uploadMultiple:', error);
        res.status(500).json({ message: 'An error occurred while uploading the files.' });
    }
}




export const mediaController = {
    uploadMultiple,
    uploadSingle
}