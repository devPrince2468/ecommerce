import { User } from "../Entities/User";
import { AppDataSource } from "../Utils/Database";

export const userRepository = AppDataSource.getRepository(User);