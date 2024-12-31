import { Request, RequestHandler, Response } from "express";
import { Category } from "../Entities/Category";
import { categoryRepository } from "../Repositories";
import { QueryFailedError } from "typeorm";

const addCategory: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const createCategory = await categoryRepository.create(req.body);

        // await createCategory.validateCategory();
        // await Category.validateCategory();

        const response = await categoryRepository.save(createCategory);
        res.status(201).json({
            success: true,
            message: "category created!",
            category: response
        });

    } catch (error) {

        if (error instanceof QueryFailedError) {
            // Handle duplicate email error
            if (error.message.includes('duplicate key value violates unique constraint')) {
                res.status(409).json({
                    success: false,
                    message: "category already exists"
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

        console.error("Error creating category:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error occurred"
        });

    }
};

const getAllCategory: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await categoryRepository.find({ relations: ['subcategories'] });

        res.status(200).json({
            success: true,
            message: "User registered successfully!",
            categories: response
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error occurred",
            error: error
        });
    }

};

const getOne: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const category = await categoryRepository.findOne({
            where: { id: parseInt(req.params.id, 10) },
            relations: ['subcategories'],
        });
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return
        }

        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error while fetching category', error });
    }
}

const removeCategory: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { name } = req.body;
    try {
        await categoryRepository.delete({ name: name });

        res.status(200).json({
            success: true,
            message: "Category deleted successfully!",
        });
    } catch (error) {
        console.error("Error deleting Category:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting Category"
        });
    }
};


const updateCategory: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const { name } = req.body;

    try {

        const category = await categoryRepository.findOne({
            where: { id: parseInt(id, 10) },
        });

        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }

    } catch (error) {

    }




};






export const categoryController = {
    addCategory,
    getAllCategory,
    removeCategory,
    updateCategory,
    getOne
};