import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "root",
    database: "ecommerce",
    entities: ["src/Entities/*{.ts,.js}"],
    synchronize: true,
    logging: true
});