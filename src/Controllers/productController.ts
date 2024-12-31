import { Request, RequestHandler, Response } from "express";
import { QueryFailedError } from "typeorm";
import { productRepository, categoryRepository } from "../Repositories";

const createProduct: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { name, description, price, stockQuantity, sku, categoryId } = req.body;

    if (!name || !description || !price || !stockQuantity || !sku || !categoryId) {
        res.status(400).json({
            success: false,
            message: "Missing required fields"
        });
        return;
    }

    try {
        const category = await categoryRepository.findOne({ where: { id: categoryId } });
        if (!category) {
            res.status(404).json({
                success: false,
                message: "Category not found"
            });
            return;
        }

        const product = productRepository.create({
            name,
            description,
            price,
            stockQuantity,
            sku,
            category: category
        });

        const savedProduct = await productRepository.save(product);

        res.status(201).json({
            success: true,
            message: "Product created successfully!",
            product: savedProduct
        });
    } catch (error) {
        if (error instanceof QueryFailedError) {
            if (error.message.includes('duplicate key value violates unique constraint')) {
                res.status(409).json({
                    success: false,
                    message: "Product with this name or SKU already exists"
                });
                return;
            }
        }

        console.error("Error creating product:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error occurred during product creation"
        });
    }
};

const getAllProducts: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await productRepository.find({ relations: ["category"] });

        res.status(200).json({
            success: true,
            products: products
        });
    } catch (error) {
        console.error("Error getting products:", error);
        res.status(500).json({
            success: false,
            message: "Error getting products"
        });
    }
};

const getProductById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const product = await productRepository.findOne({
            where: { id },
            relations: ["category"]
        });

        if (!product) {
            res.status(404).json({
                success: false,
                message: "Product not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            product: product
        });
    } catch (error) {
        console.error("Error getting product:", error);
        res.status(500).json({
            success: false,
            message: "Error getting product"
        });
    }
};

const updateProduct: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, description, price, stockQuantity, sku, isActive, categoryId } = req.body;

    try {
        const product = await productRepository.findOne({ where: { id } });

        if (!product) {
            res.status(404).json({
                success: false,
                message: "Product not found"
            });
            return;
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.stockQuantity = stockQuantity || product.stockQuantity;
        product.sku = sku || product.sku;
        product.isActive = isActive !== undefined ? isActive : product.isActive;
        if (categoryId) {
            const category = await categoryRepository.findOne({ where: { id: categoryId } });
            if (!category) {
                res.status(404).json({
                    success: false,
                    message: "Category not found"
                });
                return;
            }
            product.category = category;
        }

        const updatedProduct = await productRepository.save(product);

        res.status(200).json({
            success: true,
            message: "Product updated successfully!",
            product: updatedProduct
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            success: false,
            message: "Error updating product"
        });
    }
};

const deleteProduct: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const result = await productRepository.delete(id);

        if (result.affected === 0) {
            res.status(404).json({
                success: false,
                message: "Product not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully!"
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting product"
        });
    }
};

export const productController = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};

