import { Category } from "../Entities/Category";
import { Subcategory } from "../Entities/Subcategory";
import { User } from "../Entities/User";
import { AppDataSource } from "../Utils/Database";

export const userRepository = AppDataSource.getRepository(User);

export const categoryRepository = AppDataSource.getRepository(Category);

export const subcategoryRepository = AppDataSource.getRepository(Subcategory);