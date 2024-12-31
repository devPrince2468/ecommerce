import { Request, RequestHandler, Response } from "express";
import { QueryFailedError } from "typeorm";
import { categoryRepository, subcategoryRepository } from "../Repositories";


const addSubcategory: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoryId, ...subcategoryData } = req.body;
        const category = await categoryRepository.findOne({
            where: { id: categoryId },
        });

        if (!category) {
            res.status(404).json({
                success: false,
                message: "Category not found"
            });
            return;
        }

        const createSubcategory = subcategoryRepository.create({
            ...subcategoryData,
            category: category
        });

        const response = await subcategoryRepository.save(createSubcategory);
        res.status(201).json({
            success: true,
            message: "Subcategory created!",
            subcategory: response
        });

    } catch (error) {
        if (error instanceof QueryFailedError) {
            if (error.message.includes('duplicate key value violates unique constraint')) {
                res.status(409).json({
                    success: false,
                    message: "Subcategory already exists"
                });
                return;
            }
        }

        console.error("Error creating subcategory:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error occurred"
        });
    }
};

const getAllSubcategories: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const subcategories = await subcategoryRepository.find({ relations: ["category"] });

        res.status(200).json({
            success: true,
            message: "Subcategories retrieved successfully!",
            subcategories: subcategories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error occurred",
            error: error
        });
    }
};

const getOneSubcategory: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const subcategory = await subcategoryRepository.findOne({
            where: { id: parseInt(req.params.id, 10) },
            relations: ["category"],
        });
        if (!subcategory) {
            res.status(404).json({
                success: false,
                message: 'Subcategory not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Subcategory retrieved successfully!",
            subcategory: subcategory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error while fetching subcategory',
            error
        });
    }
};

const updateSubcategory: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const { categoryId, ...updateData } = req.body;

    try {
        const subcategory = await subcategoryRepository.findOne({
            where: { id: parseInt(id, 10) },
            relations: ["category"],
        });

        if (!subcategory) {
            res.status(404).json({
                success: false,
                message: "Subcategory not found"
            });
            return;
        }

        if (categoryId) {
            const category = await categoryRepository.findOne({
                where: { id: categoryId },
            });
            if (!category) {
                res.status(404).json({
                    success: false,
                    message: "Category not found"
                });
                return;
            }
            subcategory.category = category;
        }

        Object.assign(subcategory, updateData);

        const updatedSubcategory = await subcategoryRepository.save(subcategory);

        res.status(200).json({
            success: true,
            message: "Subcategory updated successfully!",
            subcategory: updatedSubcategory
        });

    } catch (error) {
        console.error("Error updating Subcategory:", error);
        res.status(500).json({
            success: false,
            message: "Error updating Subcategory",
            error: error
        });
    }
};

const removeSubcategory: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { name } = req.params;
    try {

        const result = await subcategoryRepository.delete({ name: name });

        if (result.affected === 0) {
            res.status(404).json({
                success: false,
                message: "Subcategory not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Subcategory deleted successfully!",
        });
    } catch (error) {
        console.error("Error deleting Subcategory:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting Subcategory"
        });
    }
};

export const subcategoryController = {
    addSubcategory,
    getAllSubcategories,
    getOneSubcategory,
    updateSubcategory,
    removeSubcategory
};

